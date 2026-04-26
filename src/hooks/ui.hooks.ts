import { Before } from '@cucumber/cucumber';
import { CustomWorld } from '../fixtures/world';
import { logger } from '../utils/logger/logger';

/**
 * UI-specific hooks
 */

Before({ tags: '@ui' }, async function (this: CustomWorld) {
  logger.info('Initializing browser for UI tests');
  await this.initializeBrowser();

  // Set viewport
  if (this.page) {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    logger.info('Viewport set to 1920x1080');
  }
});
