import { Before } from '@cucumber/cucumber';
import { CustomWorld } from '../fixtures/world';
import { ApiClient } from '../api/clients/api.client';
import { logger } from '../utils/logger/logger';

/**
 * API-specific hooks
 */

Before({ tags: '@api' }, async function (this: CustomWorld) {
  logger.info('Initializing API client for API tests');
  this.testData.apiClient = new ApiClient();
});
