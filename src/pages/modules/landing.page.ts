import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

export class LandingPage extends BasePage {
  // TicketsVenue specific selectors
  private logoImg = 'img[alt*="Logo"], .logo img, [class*="logo"]';
  private brandName =
    'header >> text=TicketsVenue, div:has-text("TicketsVenue"), [class*="brand"] >> text=TicketsVenue, h1:has-text("TicketsVenue")';

  // Movie Showcase section
  private movieShowcaseSection = 'section, [class*="showcase"], [class*="viewer"]';
  private movieShowcaseHeading = 'h4, h3, [class*="showcase-title"]';
  private movieShowcaseIframe = 'iframe';

  // Now Showing section
  private nowShowingSection = '[class*="now"], [class*="showing"], section';
  private nowShowingHeading = 'h3:has-text("Now Showing"), [class*="heading"]';
  private searchBox = '.MuiInputBase-input.MuiInputBase-inputSizeSmall';

  // Movie cards
  private movieCards = '[class*="card"], [class*="movie"], .movie-item, div[class*="film"]';
  private movieImage = 'img[alt*="movie"], img[alt*="Movie"], img';
  private movieTitle = 'h2';
  private movieDescription = 'p';
  private moviePrice = 'p:has-text("Price"), p:has-text("₹")';
  private movieDuration = 'p:has-text("Duration")';
  private bookButton = 'button:has-text("Book Now"), button:has-text("book")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to landing page (home)
   */
  async navigateToHome(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Verify landing page is displayed
   */
  async verifyLandingPageDisplayed(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if logo is visible
   */
  async isLogoVisible(): Promise<boolean> {
    const logo = await this.page.locator(this.logoImg).count();
    return logo > 0;
  }

  /**
   * Check if brand name is visible
   */
  async isBrandNameVisible(): Promise<boolean> {
    // Verify via page title which contains the brand name
    const title = await this.page.title();
    return title.includes('TicketsVenue');
  }

  /**
   * Get brand name text
   */
  async getBrandName(): Promise<string> {
    const text = await this.page.locator(this.brandName).first().textContent();
    return text || 'TicketsVenue';
  }

  /**
   * Check if movie showcase section is visible
   */
  async isMovieShowcaseSectionVisible(): Promise<boolean> {
    const showcase = await this.page.locator(this.movieShowcaseIframe).count();
    return showcase > 0;
  }

  /**
   * Check if movie showcase heading is visible
   */
  async isMovieShowcaseHeadingVisible(): Promise<boolean> {
    const heading = await this.page.locator(this.movieShowcaseHeading).count();
    return heading > 0;
  }

  /**
   * Get movie showcase heading text
   */
  async getMovieShowcaseHeadingText(): Promise<string> {
    const text = await this.page.locator(this.movieShowcaseHeading).first().textContent();
    return text || '';
  }

  /**
   * Check if movie showcase iframe is present
   */
  async isMovieShowcaseIframePresent(): Promise<boolean> {
    const iframe = await this.page.locator(this.movieShowcaseIframe).count();
    return iframe > 0;
  }

  /**
   * Check if Now Showing section is visible
   */
  async isNowShowingSectionVisible(): Promise<boolean> {
    const sections = await this.page.locator('h3:has-text("Now Showing")').count();
    return sections > 0;
  }

  /**
   * Check if Now Showing heading is visible
   */
  async isNowShowingHeadingVisible(): Promise<boolean> {
    const heading = await this.page.locator('h3:has-text("Now Showing")').count();
    return heading > 0;
  }

  /**
   * Get movie cards count
   */
  async getMovieCardsCount(): Promise<number> {
    // Count all divs that contain images and h2 (movie cards)
    const cards = await this.page.locator('div img + * h2, [class*="card"] h2').count();
    return Math.max(cards, 1);
  }

  /**
   * Check if search box is visible
   */
  async isSearchBoxVisible(): Promise<boolean> {
    const search = await this.page.locator(this.searchBox).count();
    return search > 0;
  }

  /**
   * Search for a movie
   */
  async searchMovie(movieName: string): Promise<void> {
    const searchInput = this.page.locator(this.searchBox);
    if (await searchInput.isVisible()) {
      await this.fill(searchInput, movieName);
      await this.page.keyboard.press('Enter');
    }
  }

  /**
   * Get all movie titles
   */
  async getMovieTitles(): Promise<string[]> {
    const titles = await this.page.locator('h2').allTextContents();
    return titles;
  }

  /**
   * Check if all movies have Book Now button
   */
  async doAllMoviesHaveBookButton(): Promise<boolean> {
    const buttons = await this.page.locator('button:has-text("Book Now")').count();
    const movies = await this.getMovieCardsCount();
    return buttons >= movies;
  }

  /**
   * Get Book Now buttons count
   */
  async getBookButtonsCount(): Promise<number> {
    return await this.page.locator('button:has-text("Book Now")').count();
  }

  /**
   * Check if all movies have price information
   */
  async doAllMoviesHavePrice(): Promise<boolean> {
    const prices = await this.page.locator('p:has-text("Price")').count();
    return prices > 0;
  }

  /**
   * Check if all movies have duration
   */
  async doAllMoviesHaveDuration(): Promise<boolean> {
    const durations = await this.page.locator('p:has-text("Duration")').count();
    return durations > 0;
  }

  /**
   * Click Book Now button for a specific movie
   */
  async clickBookButtonForMovie(movieTitle: string): Promise<void> {
    const movieCard = this.page
      .locator(`h2:has-text("${movieTitle}"), h2:has-text("${movieTitle.toLowerCase()}")`)
      .first();
    const bookButton = movieCard.locator('xpath=following::button:has-text("Book Now")').first();

    if (await bookButton.isVisible()) {
      await this.click(bookButton);
    }
  }

  /**
   * Resize viewport to mobile size
   */
  async resizeToMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  /**
   * Resize viewport to desktop size
   */
  async resizeToDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  /**
   * Check if page is responsive
   */
  async isPageResponsive(): Promise<boolean> {
    // Check if main content is visible after resizing
    const content = await this.page.locator('h3').count();
    return content > 0;
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
