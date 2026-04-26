import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from '../fixtures/world';
import { logger } from '../utils/logger/logger';

/**
 * Global hooks for all tests
 */

Before(async function (this: CustomWorld, scenario) {
  logger.info(`========== Starting Scenario: ${scenario.pickle.name} ==========`);
  logger.info(`Tags: ${scenario.pickle.tags.map((t) => t.name).join(', ') || 'None'}`);
});

After(async function (this: CustomWorld, scenario) {
  const status = scenario.result?.status;

  if (status === Status.FAILED) {
    logger.error(`Scenario FAILED: ${scenario.pickle.name}`);
    if (this.page) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.page.screenshot({
          path: `reports/failures/${scenario.pickle.name}-${timestamp}.png`,
        });
        logger.info(`Screenshot saved for failed scenario`);
      } catch (error) {
        logger.error(`Failed to take screenshot: ${error}`);
      }
    }
  } else {
    logger.info(`Scenario ${status}: ${scenario.pickle.name}`);
  }

  await this.closeBrowser();
  this.clearTestData();
  logger.info(`========== Completed Scenario: ${scenario.pickle.name} ==========\n`);
});
