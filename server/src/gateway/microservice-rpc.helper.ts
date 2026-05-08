import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

const RPC_TIMEOUT_MS = 10_000;

function stringifyRpcMessage(value: unknown, depth = 0): string {
  if (value == null || depth > 8) {
    return 'Erro ao comunicar com o microserviço';
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
      if (
        inner !== 'Erro ao comunicar com o microserviço' ||
        Object.keys(o).length === 1
      ) {
        return inner;
      }
    }
    if (typeof o['error'] === 'string') {
      return o['error'];
    }
    try {
      return JSON.stringify(o);
    } catch {
      return 'Erro ao comunicar com o microserviço';
    }
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

function unwrapMicroserviceError(err: unknown): never {
  if (!err || typeof err !== 'object') {
    throw new HttpException('Erro ao comunicar com o microserviço', 502);
  }
  const obj = err as Record<string, unknown>;
  const status = extractHttpStatus(obj);
  const message = stringifyRpcMessage(
    obj['response'] ?? obj['payload'] ?? obj['message'] ?? obj,
    0,
  );

  throw new HttpException(message, status);
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
    unwrapMicroserviceError(err);
  }
}
