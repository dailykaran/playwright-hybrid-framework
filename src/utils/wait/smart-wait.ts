import { Page } from '@playwright/test';
import { logger } from '../logger/logger';

export class SmartWait {
  private page: Page;
  private defaultTimeout = 30000;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(selector: string, timeout = this.defaultTimeout): Promise<void> {
    logger.info(`Waiting for element "${selector}" to be visible`);
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    } catch (error) {
      logger.error(`Element "${selector}" not visible within ${timeout}ms`);
      throw error;
    }
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string, timeout = this.defaultTimeout): Promise<void> {
    logger.info(`Waiting for element "${selector}" to be hidden`);
    try {
      await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
    } catch (error) {
      logger.error(`Element "${selector}" not hidden within ${timeout}ms`);
      throw error;
    }
  }

  /**
   * Wait for text to appear
   */
  async waitForText(selector: string, text: string, timeout = this.defaultTimeout): Promise<void> {
    logger.info(`Waiting for text "${text}" in element "${selector}"`);
    try {
      await this.page.locator(selector).waitFor({ timeout });
      const content = await this.page.locator(selector).textContent();
      if (!content?.includes(text)) {
        throw new Error(`Text "${text}" not found in element`);
      }
    } catch (error) {
      logger.error(`Text "${text}" not found within ${timeout}ms`);
      throw error;
    }
  }

  /**
   * Wait for URL to match
   */
  async waitForUrl(urlPattern: string | RegExp, timeout = this.defaultTimeout): Promise<void> {
    logger.info(`Waiting for URL to match: ${urlPattern}`);
    try {
      await this.page.waitForURL(urlPattern, { timeout });
    } catch (error) {
      logger.error(`URL did not match "${urlPattern}" within ${timeout}ms`);
      throw error;
    }
  }

  /**
   * Wait for specific time
   */
  async wait(milliseconds: number): Promise<void> {
    logger.info(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(timeout = this.defaultTimeout): Promise<void> {
    logger.info('Waiting for network to be idle');
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      logger.error(`Network did not become idle within ${timeout}ms`);
      throw error;
    }
  }

  /**
   * Wait for DOM to be ready
   */
  async waitForDomReady(timeout = this.defaultTimeout): Promise<void> {
    logger.info('Waiting for DOM to be ready');
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout });
    } catch (error) {
      logger.error(`DOM not ready within ${timeout}ms`);
      throw error;
    }
  }
}
