import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

export class FooterComponent extends BasePage {
  private footerLinks = '[data-testid="footer-link"]';
  private copyrightText = '[data-testid="copyright"]';
  private socialMediaLinks = '[data-testid="social-link"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get footer links count
   */
  async getFooterLinksCount(): Promise<number> {
    return await this.page.locator(this.footerLinks).count();
  }

  /**
   * Click footer link by text
   */
  async clickFooterLink(text: string): Promise<void> {
    await this.click(`${this.footerLinks}:has-text("${text}")`);
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    return await this.getText(this.copyrightText);
  }

  /**
   * Get social media links count
   */
  async getSocialMediaLinksCount(): Promise<number> {
    return await this.page.locator(this.socialMediaLinks).count();
  }

  /**
   * Verify footer is visible
   */
  async verifyFooterVisible(): Promise<boolean> {
    return await this.isVisible(this.copyrightText);
  }
}
