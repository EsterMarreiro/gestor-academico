import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/events',
  cors: { origin: process.env.WS_CORS_ORIGIN ?? '*' },
})
export class RealtimeEventsGateway {
  private readonly logger = new Logger(RealtimeEventsGateway.name);

  @WebSocketServer()
  server!: Server;

  emit(eventName: string, payload: unknown): void {
    this.server.emit(eventName, payload);
    this.logger.debug(`Evento em tempo real emitido: ${eventName}`);
  }
}
