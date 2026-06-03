import { HttpException } from '@nestjs/common';
import { throwError, of } from 'rxjs';
import { sendRpc } from './microservice-rpc.helper';

describe('sendRpc', () => {
  const clientMock = {
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the microservice payload when the call succeeds', async () => {
    clientMock.send.mockReturnValue(of({ ok: true }));

    await expect(
      sendRpc(clientMock as never, 'pattern', { id: 1 }),
    ).resolves.toEqual({
      ok: true,
    });
    expect(clientMock.send).toHaveBeenCalledWith('pattern', { id: 1 });
  });

  it('maps transport errors to 502', async () => {
    clientMock.send.mockReturnValue(
      throwError(() => new Error('connect ECONNREFUSED 127.0.0.1:4001')),
    );

    await expect(
      sendRpc(clientMock as never, 'pattern', {}),
    ).rejects.toMatchObject({
      status: 502,
    });
  });

  it('preserves microservice http-like status and message', async () => {
    clientMock.send.mockReturnValue(
      throwError(() => ({
        statusCode: 404,
        message: 'Registro não encontrado',
      })),
    );

    try {
      await sendRpc(clientMock as never, 'pattern', {});
      throw new Error('Expected sendRpc to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(404);
      expect((error as HttpException).getResponse()).toBe(
        'Registro não encontrado',
      );
    }
  });

  it('expands generic internal server errors to a clearer message', async () => {
    clientMock.send.mockReturnValue(
      throwError(() => ({
        statusCode: 500,
        message: 'Internal Server Error',
        cause: { code: 'EFAIL' },
      })),
    );

    try {
      await sendRpc(clientMock as never, 'pattern', {});
      throw new Error('Expected sendRpc to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(500);
      expect(String((error as Error).message)).toContain(
        'O microserviço devolveu erro genérico',
      );
    }
  });

  it('maps invalid empty responses to 502 with fallback text', async () => {
    clientMock.send.mockReturnValue(throwError(() => null));

    await expect(
      sendRpc(clientMock as never, 'pattern', {}),
    ).rejects.toMatchObject({
      status: 502,
    });
  });
});
