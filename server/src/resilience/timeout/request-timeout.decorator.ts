import { SetMetadata } from '@nestjs/common';

export const REQUEST_TIMEOUT_METADATA = 'request-timeout-ms';

export const RequestTimeout = (timeoutMs: number) =>
  SetMetadata(REQUEST_TIMEOUT_METADATA, timeoutMs);
