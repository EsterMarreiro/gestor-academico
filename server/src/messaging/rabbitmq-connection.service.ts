import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { Channel, ConsumeMessage, Options } from 'amqplib';
import { randomUUID } from 'node:crypto';

export type RabbitMqSubscriptionOptions<TPayload> = {
  exchange: string;
  exchangeType: 'direct' | 'topic' | 'fanout' | 'headers';
  queue: string;
  routingKeys: string[];
  consumerTag: string;
  onMessage: (payload: TPayload) => Promise<void> | void;
  prefetch?: number;
};

@Injectable()
export class RabbitMqConnectionService implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqConnectionService.name);
  private readonly connection: AmqpConnectionManager;
  private readonly publisherChannel: ChannelWrapper;
  private readonly consumerChannels: ChannelWrapper[] = [];

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>(
      'RABBITMQ_URL',
      'amqp://gestor:gestor@127.0.0.1:5672',
    );

    this.connection = amqp.connect([url], {
      heartbeatIntervalInSeconds: 60,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () => {
      this.logger.log(`Ligado ao RabbitMQ em ${url}`);
    });
    this.connection.on('disconnect', ({ err }) => {
      this.logger.warn(
        `Ligação RabbitMQ interrompida: ${err?.message ?? 'sem detalhe'}`,
      );
    });

    this.publisherChannel = this.connection.createChannel();
  }

  async publish(
    exchange: string,
    routingKey: string,
    payload: Record<string, unknown>,
    exchangeType: 'direct' | 'topic' | 'fanout' | 'headers' = 'topic',
  ): Promise<void> {
    const body = Buffer.from(JSON.stringify(payload));
    const options: Options.Publish = {
      persistent: true,
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageId: randomUUID(),
      timestamp: Date.now(),
    };

    await this.publisherChannel.addSetup(async (channel: Channel) => {
      await channel.assertExchange(exchange, exchangeType, {
        durable: true,
      });
    });

    await this.publisherChannel.publish(exchange, routingKey, body, options);
  }

  async subscribe<TPayload>(
    options: RabbitMqSubscriptionOptions<TPayload>,
  ): Promise<void> {
    const channelWrapper = this.connection.createChannel({
      setup: async (channel: Channel) => {
        await channel.assertExchange(
          options.exchange,
          options.exchangeType,
          {
            durable: true,
          },
        );
        await channel.assertQueue(options.queue, { durable: true });
        for (const routingKey of options.routingKeys) {
          await channel.bindQueue(options.queue, options.exchange, routingKey);
        }
        await channel.prefetch(options.prefetch ?? 1);
        await channel.consume(
          options.queue,
          async (message) => {
            if (!message) {
              return;
            }

            await this.handleMessage(channel, message, options);
          },
          {
            noAck: false,
            consumerTag: options.consumerTag,
          },
        );
      },
    });

    this.consumerChannels.push(channelWrapper);
  }

  async onModuleDestroy() {
    for (const channel of this.consumerChannels) {
      await channel.close();
    }
    await this.publisherChannel.close();
    await this.connection.close();
  }

  private async handleMessage<TPayload>(
    channel: Channel,
    message: ConsumeMessage,
    options: RabbitMqSubscriptionOptions<TPayload>,
  ) {
    try {
      const payload = JSON.parse(message.content.toString('utf-8')) as TPayload;
      await options.onMessage(payload);
      channel.ack(message);
    } catch (error) {
      this.logger.warn(
        `Falha ao processar mensagem ${message.fields.routingKey}; reenfileirando: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      channel.nack(message, false, true);
    }
  }
}
