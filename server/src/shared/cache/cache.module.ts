import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        try {
          const store = await redisStore({
            socket: {
              host: config.get('REDIS_HOST', '127.0.0.1'),
              port: Number(config.get('REDIS_PORT', 6379)),
            },
            password: config.get('REDIS_PASSWORD') ?? undefined,
            username: config.get('REDIS_USERNAME') ?? undefined,
          });

          return {
            store,
            ttl: 300,
          };
        } catch (error) {
          console.warn(
            'Redis cache unavailable, falling back to in-memory cache.',
            error,
          );

          return {
            ttl: 300,
          };
        }
      },
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigurationModule {}
