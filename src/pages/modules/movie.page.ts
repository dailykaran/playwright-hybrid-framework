import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

export class MoviePage extends BasePage {
  // TicketsVenue specific selectors
  private movieImg = '.MuiStack-root img';
  private movieInformation = '.MuiBox-root div h5:first-of-type';
    

  // Movie youtube section
  private movieTrailerPlayButton = '[title="Play video"]';
  private movieTrailerIframe = 'iframe';
  private videoPlayer = 'body #player-controls';

  // Now Showing section
  private searchBox = '.MuiInputBase-input.MuiInputBase-inputSizeSmall';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Movie page - this is a placeholder and should be updated with actual navigation logic
   */
  async navigateToMoviePage(): Promise<void> {
    await this.goto('/movie/5');
    await this.page.waitForLoadState('networkidle');
  }

   /**
   * Check if movie image is visible
   */
  async isMovieImgVisible(): Promise<boolean> {
    const movieImg = await this.page.locator(this.movieImg).count();
    return movieImg > 0;
  }

  async isMovieInformationVisible(): Promise<string> {
    const movieInfo = await this.page.getByRole('heading', { name: 'Movie Synopsis' }).innerText();
    return movieInfo;
  }

  async isYoutubeVisible(): Promise<boolean> {
    await this.page.getByRole('button', { name: 'Watch Trailer' }).click();
    await this.page.waitForSelector(this.movieTrailerIframe, { state: 'visible', timeout: 10000 });
    const youtubeIframe = await this.page.frameLocator(this.movieTrailerIframe);
    await youtubeIframe.locator(this.videoPlayer).focus();
    return true;
  }

  async isVideoPlayable(): Promise<boolean> {
    const getIframePlayer = await this.page.frameLocator(this.movieTrailerIframe);
    const videoPlayer = await getIframePlayer.locator(this.movieTrailerPlayButton);
    await videoPlayer.waitFor({ state: 'visible' });
    await videoPlayer.click();
    await this.page.waitForTimeout(2000); // Wait for a few seconds to allow the video to start playing
    await this.page.keyboard.press('Space'); // Pause the video after playing for a few seconds
    return true;
  }
}
