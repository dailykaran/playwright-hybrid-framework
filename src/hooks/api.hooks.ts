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

  // Check if authentication is required
  const environment = process.env.ENVIRONMENT || 'dev';
  if (environment !== 'api-movies') {
    logger.info('Authentication may be required for this environment');
  } else {
    logger.info('No authentication required for Movies API (localhost:5000)');
  }
});
