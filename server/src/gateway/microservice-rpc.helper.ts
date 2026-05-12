import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

const RPC_TIMEOUT_MS = 10_000;

const TCP_DOWN_HINT =
  'Microserviço TCP indisponível ou ligação falhou. Na pasta server execute `npm run start:dev` ' +
  '(gateway + todos os microserviços) ou o script do serviço em falta (ex.: `npm run start:turmas-ms:dev` na porta ' +
  '4002, `npm run start:matriculas-ms:dev` na 4005). Com Docker, confirme o contentor do MS e variáveis *_MS_HOST.';

/** Texto agregado para detetar falhas de rede / transporte. */
function collectErrorText(err: unknown, depth = 0, maxDepth = 10): string {
  if (err == null || depth > maxDepth) return '';
  if (typeof err === 'string') return err;
  if (typeof err === 'number' || typeof err === 'boolean') return String(err);
  if (typeof err !== 'object') return String(err);
  const o = err as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of ['message', 'code', 'name', 'stack', 'errno', 'syscall']) {
    const v = o[key];
    if (typeof v === 'string' || typeof v === 'number') parts.push(String(v));
  }
  if (o['cause']) parts.push(collectErrorText(o['cause'], depth + 1, maxDepth));
  if (Array.isArray(o['errors'])) {
    for (const e of o['errors'] as unknown[]) {
      parts.push(collectErrorText(e, depth + 1, maxDepth));
    }
  }
  if (depth < 4) {
    for (const v of Object.values(o)) {
      if (v != null && typeof v === 'object') {
        parts.push(collectErrorText(v, depth + 1, maxDepth));
      }
    }
  }
  return parts.filter(Boolean).join('\n');
}

function isTransportFailure(err: unknown): boolean {
  const t = collectErrorText(err).toUpperCase();
  return (
    t.includes('ECONNREFUSED') ||
    t.includes('ECONNRESET') ||
    t.includes('EPIPE') ||
    t.includes('ETIMEDOUT') ||
    t.includes('ENOTFOUND') ||
    t.includes('SOCKET HANG UP') ||
    t.includes('NO ELEMENTS IN SEQUENCE')
  );
}

function isTimeoutLike(err: unknown): boolean {
  const o = err as Record<string, unknown> | null;
  const name = typeof o?.['name'] === 'string' ? o['name'] : '';
  const msg = typeof o?.['message'] === 'string' ? o['message'] : '';
  return (
    name === 'TimeoutError' ||
    msg.toLowerCase().includes('timeout') ||
    msg.toLowerCase().includes('timed out')
  );
}

function safeJsonStringify(value: unknown, maxLen = 800): string {
  const seen = new WeakSet<object>();
  try {
    const s = JSON.stringify(value, (_k, v) => {
      if (typeof v === 'object' && v !== null) {
        if (seen.has(v)) return '[Circular]';
        seen.add(v);
      }
      return v;
    });
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
  } catch {
    return '';
  }
}

function stringifyRpcMessage(value: unknown, depth = 0): string {
  if (value == null || depth > 8) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((v) => stringifyRpcMessage(v, depth + 1)).join('; ');
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    if ('message' in o && o['message'] != null && o['message'] !== value) {
      const inner = stringifyRpcMessage(o['message'], depth + 1);
      if (inner) return inner;
    }
    if (typeof o['error'] === 'string') {
      return o['error'];
    }
    const j = safeJsonStringify(o);
    if (j) return j;
  }
  return String(value);
}

function extractHttpStatus(obj: Record<string, unknown>, depth = 0): number {
  if (depth > 8) return 502;
  for (const key of ['statusCode', 'status']) {
    const n = Number(obj[key]);
    if (Number.isFinite(n) && n >= 400 && n < 600) return n;
  }
  const msg = obj['message'];
  if (msg && typeof msg === 'object' && msg !== null) {
    const nested = extractHttpStatus(msg as Record<string, unknown>, depth + 1);
    if (nested !== 502) return nested;
  }
  const response = obj['response'];
  if (response && typeof response === 'object' && response !== null) {
    const nested = extractHttpStatus(response as Record<string, unknown>, depth + 1);
    if (nested !== 502) return nested;
  }
  return 502;
}

function buildFallbackMessage(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err instanceof Error) {
    return err.stack ?? err.message;
  }
  if (err && typeof err === 'object') {
    const o = err as Record<string, unknown>;
    const m = o['message'];
    if (typeof m === 'string' && m) return m;
    const j = safeJsonStringify(err);
    if (j) return j;
  }
  return collectErrorText(err) || 'Falha desconhecida na chamada RPC.';
}

function unwrapMicroserviceError(err: unknown): never {
  if (isTransportFailure(err)) {
    throw new HttpException(TCP_DOWN_HINT, 502);
  }
  if (isTimeoutLike(err)) {
    throw new HttpException(
      `Tempo esgotado ao aguardar o microserviço (${RPC_TIMEOUT_MS} ms). Verifique se o processo TCP está a responder.`,
      504,
    );
  }
  if (!err || typeof err !== 'object') {
    const msg = buildFallbackMessage(err);
    throw new HttpException(
      msg
        ? `Erro na comunicação com o microserviço: ${msg.slice(0, 600)}`
        : 'Erro na comunicação com o microserviço (resposta vazia ou inválida).',
      502,
    );
  }
  const obj = err as Record<string, unknown>;
  const status = extractHttpStatus(obj);
  let message = stringifyRpcMessage(
    obj['response'] ?? obj['payload'] ?? obj['message'] ?? obj,
  );

  if (!message || message === '{}' || message === '[]') {
    message = buildFallbackMessage(err);
  }

  const generic =
    /^erro ao comunicar com o microserviço$/i.test(message.trim()) ||
    /^internal server error\.?$/i.test(message.trim());

  if (generic) {
    const raw = collectErrorText(err);
    message =
      'O microserviço devolveu erro genérico ou a resposta não foi interpretada. ' +
      'Veja o terminal do processo TCP (prefixo [nome-ms]). ' +
      (raw ? `Detalhe: ${raw.slice(0, 500)}` : '');
  }

  throw new HttpException(message || 'Falha na chamada ao microserviço.', status);
}

export async function sendRpc<T>(
  client: ClientProxy,
  pattern: string,
  payload: unknown,
): Promise<T> {
  try {
    return await firstValueFrom(
      client.send<T>(pattern, payload).pipe(timeout(RPC_TIMEOUT_MS)),
    );
  } catch (err) {
    if (isTransportFailure(err)) {
      throw new HttpException(TCP_DOWN_HINT, 502);
    }
    unwrapMicroserviceError(err);
  }
}
