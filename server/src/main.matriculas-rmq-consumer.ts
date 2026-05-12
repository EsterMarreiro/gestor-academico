import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RMQ_QUEUE_MATRICULAS_EVENTS } from './messaging/rmq.constants';
import { MatriculasRmqConsumerAppModule } from './microservice-apps/matriculas-rmq-consumer-app.module';

async function bootstrap() {
  const urls = [
    process.env.RABBITMQ_URL ?? 'amqp://gestor:gestor@127.0.0.1:5672',
  ];
  const app = await NestFactory.createMicroservice(
    MatriculasRmqConsumerAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls,
        queue: RMQ_QUEUE_MATRICULAS_EVENTS,
        queueOptions: {
          durable: true,
        },
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `Consumidor RabbitMQ à escuta na fila "${RMQ_QUEUE_MATRICULAS_EVENTS}" (${urls[0]})`,
    'MatriculasRmqConsumer',
  );
}

void bootstrap().catch((err) => {
  Logger.error(
    `Falha ao iniciar consumidor RMQ: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
    undefined,
    'MatriculasRmqConsumer',
  );
  process.exitCode = 1;
});
