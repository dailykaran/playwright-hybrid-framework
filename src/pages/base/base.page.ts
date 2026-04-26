import { Page, Locator, expect } from '@playwright/test';
import { logger } from '@utils/logger/logger';
import { SmartWait } from '@utils/wait/smart-wait';
import { RetryHandler } from '@utils/retry/retry-handler';
import { configManager } from '@utils/config/config-manager';

export class BasePage {
  protected page: Page;
  protected smartWait: SmartWait;
  protected retryHandler: RetryHandler;

  constructor(page: Page) {
    this.page = page;
    this.smartWait = new SmartWait(page);
    this.retryHandler = new RetryHandler();
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string, options = {}): Promise<void> {
    // Construct full URL by combining baseUrl with the provided path
    const baseUrl = configManager.getBaseUrl();
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    logger.info(`Navigating to URL: ${fullUrl}`);
    await this.page.goto(fullUrl, { waitUntil: 'networkidle', ...options });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Click on an element
   */
  async click(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Clicking on element: ${locator}`);
    await this.retryHandler.execute(async () => {
      await element.click({ timeout: 10000 });
    });
  }

  /**
   * Fill input field
   */
  async fill(locator: string | Locator, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Filling text "${text}" in element: ${locator}`);
    await this.retryHandler.execute(async () => {
      await element.fill(text, { timeout: 10000 });
    });
  }

  /**
   * Get input value
   */
  async getValue(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const value = await element.inputValue();
    logger.info(`Retrieved value: ${value}`);
    return value;
  }

  /**
   * Get element text
   */
  async getText(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const text = await element.textContent();
    logger.info(`Retrieved text: ${text}`);
    return text || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  /**
   * Wait for element visibility
   */
  async waitForElement(locator: string | Locator, timeout = 30000): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Waiting for element: ${locator}`);
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Verify element text
   */
  async verifyText(locator: string | Locator, expectedText: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Verifying text "${expectedText}" in element: ${locator}`);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Select option from dropdown
   */
  async selectOption(locator: string | Locator, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Selecting option "${value}" from dropdown: ${locator}`);
    await element.selectOption(value);
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: string | Locator): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isEnabled();
  }

  /**
   * Hover over element
   */
  async hover(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Hovering over element: ${locator}`);
    await element.hover();
  }

  /**
   * Double click on element
   */
  async doubleClick(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Double clicking on element: ${locator}`);
    await element.dblclick();
  }

  /**
   * Right click on element
   */
  async rightClick(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Right clicking on element: ${locator}`);
    await element.click({ button: 'right' });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Scrolling to element: ${locator}`);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename: string): Promise<void> {
    logger.info(`Taking screenshot: ${filename}`);
    await this.page.screenshot({ path: `reports/${filename}.png` });
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Close the page
   */
  async closePage(): Promise<void> {
    logger.info('Closing page');
    await this.page.close();
  }
}
