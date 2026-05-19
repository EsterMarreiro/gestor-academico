import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private pubClient: ReturnType<typeof createClient> | null = null;
  private subClient: ReturnType<typeof createClient> | null = null;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);
    void this.connectToRedis()
      .then((adapter) => server.adapter(adapter))
      .catch((error) => {
        console.error('Redis adapter initialization failed', error);
      });
    return server;
  }

  private async connectToRedis() {
    if (this.pubClient && this.subClient) {
      return createAdapter(this.pubClient, this.subClient);
    }

    const redisUrl =
      process.env.REDIS_URL ||
      `redis://${process.env.REDIS_HOST ?? '127.0.0.1'}:${process.env.REDIS_PORT ?? 6379}`;

    this.pubClient = createClient({ url: redisUrl });
    this.subClient = this.pubClient.duplicate();
    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
    return createAdapter(this.pubClient, this.subClient);
  }
}
