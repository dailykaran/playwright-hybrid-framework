import { logger } from '@utils/logger/logger';

export class RetryHandler {
  private maxRetries = 3;
  private delayMs = 1000;

  /**
   * Retry a function with exponential backoff
   */
  async execute<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      delayMs?: number;
      message?: string;
    } = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries ?? this.maxRetries;
    const delayMs = options.delayMs ?? this.delayMs;
    const message = options.message ?? 'Operation';

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.info(`${message} - Attempt ${attempt}/${maxRetries}`);
        const result = await fn();
        logger.info(`${message} - Succeeded on attempt ${attempt}`);
        return result;
      } catch (error) {
        lastError = error as Error;
        logger.warn(`${message} - Attempt ${attempt} failed: ${lastError.message}`);

        if (attempt < maxRetries) {
          const waitTime = delayMs * Math.pow(2, attempt - 1);
          logger.info(`Retrying after ${waitTime}ms...`);
          await this.delay(waitTime);
        }
      }
    }

    logger.error(`${message} - Failed after ${maxRetries} attempts`);
    throw lastError;
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
