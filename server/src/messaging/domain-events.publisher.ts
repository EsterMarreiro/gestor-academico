import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_CLIENT_MATRICULA_EVENTS } from './rmq.constants';

@Injectable()
export class DomainEventsPublisher {
  private readonly logger = new Logger(DomainEventsPublisher.name);

  constructor(
    @Inject(RMQ_CLIENT_MATRICULA_EVENTS)
    private readonly client: ClientProxy,
  ) {}

  publish(pattern: string, payload: Record<string, unknown>): void {
    this.client.emit(pattern, payload).subscribe({
      error: (err: unknown) =>
        this.logger.warn(
          `Falha ao publicar ${pattern}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        ),
    });
  }
}
