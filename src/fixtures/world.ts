import { World, IWorldOptions, setWorldConstructor, Before, After, Status } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { chromium, firefox, webkit } from 'playwright';
import { logger } from '../utils/logger/logger';
import { configManager } from '../utils/config/config-manager';

export class CustomWorld extends World {
  public page!: Page;
  public context!: BrowserContext;
  public browser!: Browser;
  public testData: any = {};
  public apiResponse: any = null;
  public apiError: any = null;

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Initialize browser session
   */
  async initializeBrowser(): Promise<void> {
    const browserName = process.env.BROWSER || 'chromium';
    
    switch (browserName) {
      case 'firefox':
        this.browser = await firefox.launch({
          headless: configManager.isHeadless(),
          slowMo: configManager.getSlowMo()
        });
        break;
      case 'webkit':
        this.browser = await webkit.launch({
          headless: configManager.isHeadless(),
          slowMo: configManager.getSlowMo()
        });
        break;
      default:
        this.browser = await chromium.launch({
          headless: configManager.isHeadless(),
          slowMo: configManager.getSlowMo()
        });
    }

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    
    logger.info(`Browser initialized: ${browserName}`);
  }

  /**
   * Close browser session
   */
  async closeBrowser(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    logger.info('Browser closed');
  }

  /**
   * Set test data
   */
  setTestData(key: string, value: any): void {
    this.testData[key] = value;
    logger.info(`Test data set: ${key}`);
  }

  /**
   * Get test data
   */
  getTestData(key: string): any {
    return this.testData[key];
  }

  /**
   * Set API response
   */
  setApiResponse(response: any): void {
    this.apiResponse = response;
  }

  /**
   * Get API response
   */
  getApiResponse(): any {
    return this.apiResponse;
  }

  /**
   * Set API error
   */
  setApiError(error: any): void {
    this.apiError = error;
  }

  /**
   * Get API error
   */
  getApiError(): any {
    return this.apiError;
  }

  /**
   * Clear test data
   */
  clearTestData(): void {
    this.testData = {};
    this.apiResponse = null;
    this.apiError = null;
    logger.info('Test data cleared');
  }
}

setWorldConstructor(CustomWorld);
