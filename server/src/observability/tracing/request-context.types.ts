export interface RequestContextStore {
  requestId: string;
  correlationId: string;
  traceId: string;
  spanId: string;
}

export interface RequestContextHttpRequest {
  id?: string;
  requestId?: string;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
}
