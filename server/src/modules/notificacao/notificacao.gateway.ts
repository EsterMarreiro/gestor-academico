import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'notificacoes', cors: true })
export class NotificacaoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificacaoGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { usuarioId: number }) {
    if (payload?.usuarioId) {
      void client.join(`user_${payload.usuarioId}`);
      this.logger.log(`Client ${client.id} joined user_${payload.usuarioId}`);
    }
    return { status: 'joined' };
  }

  broadcastNotification(notification: unknown) {
    this.server.emit('notification', notification);
  }

  sendToUser(usuarioId: number, notification: unknown) {
    this.server.to(`user_${usuarioId}`).emit('notification', notification);
  }
}
