import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ResilienceConfigService } from '../resilience.config';

type PendingTask<T> = {
  dependency: string;
  execute: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};

@Injectable()
export class BulkheadService {
  private active = 0;
  private readonly queue: Array<PendingTask<unknown>> = [];

  constructor(private readonly config: ResilienceConfigService) {}

  async run<T>(dependency: string, execute: () => Promise<T>): Promise<T> {
    const { maxConcurrent, maxQueue } = this.config.bulkhead;

    if (this.active < maxConcurrent) {
      return this.executeTask({ dependency, execute });
    }

    if (this.queue.length >= maxQueue) {
      throw new ServiceUnavailableException(
        `Bulkhead lotado para ${dependency}.`,
      );
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        dependency,
        execute,
        resolve,
        reject,
      });
    });
  }

  private async executeTask<T>(task: {
    dependency: string;
    execute: () => Promise<T>;
  }): Promise<T> {
    this.active += 1;

    try {
      return await task.execute();
    } finally {
      this.active -= 1;
      this.drainQueue();
    }
  }

  private drainQueue(): void {
    const next = this.queue.shift();
    if (!next) {
      return;
    }

    void this.executeTask(next).then(next.resolve).catch(next.reject);
  }
}
