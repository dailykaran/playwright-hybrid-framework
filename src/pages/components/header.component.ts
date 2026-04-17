import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

export class HeaderComponent extends BasePage {
  private logoImage = '[data-testid="logo"]';
  private searchInput = 'input[placeholder="Search..."]';
  private searchButton = 'button[aria-label="Search"]';
  private cartIcon = '[data-testid="cart-icon"]';
  private userMenu = '[data-testid="user-menu"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Click on logo
   */
  async clickLogo(): Promise<void> {
    await this.click(this.logoImage);
  }

  /**
   * Search for products
   */
  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.click(this.searchButton);
  }

  /**
   * Click on cart icon
   */
  async clickCartIcon(): Promise<void> {
    await this.click(this.cartIcon);
  }

  /**
   * Click on user menu
   */
  async clickUserMenu(): Promise<void> {
    await this.click(this.userMenu);
  }

  /**
   * Verify logo is visible
   */
  async verifyLogoVisible(): Promise<boolean> {
    return await this.isVisible(this.logoImage);
  }
}
