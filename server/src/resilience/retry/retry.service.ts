import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ResilienceConfigService } from '../resilience.config';

@Injectable()
export class RetryService {
  constructor(
    private readonly config: ResilienceConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RetryService.name);
  }

  async execute<T>(
    operation: () => Promise<T>,
    canRetry: (error: unknown) => boolean,
    description: string,
  ): Promise<T> {
    const { attempts, initialDelayMs, maxDelayMs } = this.config.retry;
    let currentAttempt = 0;

    while (true) {
      try {
        return await operation();
      } catch (error) {
        currentAttempt += 1;

        if (currentAttempt >= attempts || !canRetry(error)) {
          throw error;
        }

        const delay = Math.min(
          initialDelayMs * 2 ** (currentAttempt - 1),
          maxDelayMs,
        );

        this.logger.warn(
          {
            attempt: currentAttempt,
            nextDelayMs: delay,
            description,
          },
          'Retrying failed operation',
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
