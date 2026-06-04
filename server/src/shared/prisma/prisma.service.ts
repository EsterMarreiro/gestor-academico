import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { MetricsService } from '../../observability/metrics/metrics.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly metrics: MetricsService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
      ],
    });

    this.$on('query' as never, (event: Prisma.QueryEvent) => {
      this.metrics.recordDatabaseOperation(
        event.query.split(' ')[0]?.toUpperCase() || 'QUERY',
        event.duration,
        'success',
      );
    });

    this.$on('error' as never, () => {
      this.metrics.recordDatabaseOperation('ERROR', 0, 'error');
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      this.logger.warn(
        'Nao foi possivel conectar ao banco. API iniciada sem conexao com DB.',
      );
      this.logger.debug(String(error));
    }
  }
}
