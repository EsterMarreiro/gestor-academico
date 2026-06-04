import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class GatewayCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async remember<T>(key: string, factory: () => Promise<T>): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached !== undefined && cached !== null) {
      return cached;
    }

    const fresh = await factory();
    await this.cache.set(key, fresh);
    return fresh;
  }

  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async deleteMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.cache.del(key)));
  }
}
