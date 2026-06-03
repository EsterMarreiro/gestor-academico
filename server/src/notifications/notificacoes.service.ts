import { Injectable, Logger } from '@nestjs/common';
import { MatriculaCriadaPayload } from '../contracts/rmq.events';

@Injectable()
export class NotificacoesService {
  private readonly logger = new Logger(NotificacoesService.name);

  simularEmailMatriculaCriada(event: MatriculaCriadaPayload): void {
    this.logger.log(`[EMAIL SIMULADO] Matrícula ${event.matriculaId}`);
  }
}
