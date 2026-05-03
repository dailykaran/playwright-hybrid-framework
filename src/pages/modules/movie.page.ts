import { Page, expect } from '@playwright/test';
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

  async clickConfirmBookingWithoutSelectingShowtime(buttonName: string): Promise<string> {
    let alertMessage = '';

    this.page.once('dialog', async dialog => {
      alertMessage = await dialog.message();
      await dialog.accept();
    });

    await this.page.getByRole('button', { name: buttonName }).click();
    await this.page.waitForTimeout(500);
    return alertMessage;
  } 

  async selectShowtime(showtime: string): Promise<void> {
    //await this.page.getByRole('combobox', { name: 'Select Showtime' }).selectOption({ label: showtime });
     const showtimeBtn = await this.page.locator(`button[value="${showtime}"]`);
    if (await showtimeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await showtimeBtn.click();
      await this.page.waitForTimeout(500);
    }
  
    // Select one seat
    const shadowElement = this.page.locator('seat-grid');
    const seats = shadowElement.locator('.seat-grid-container .seat-grid .seat.available.clickable');
    const seatCount = await seats.count();
    
    if (seatCount > 0) {
      await seats.first().click();
      await this.page.waitForTimeout(500);
    }
  
    // Now try to confirm booking
    const confirmBtn = this.page.locator('button').filter({ hasText: /Confirm|Book/ }).first();
    if (await confirmBtn.isVisible({ timeout: 3000 })) {
      await confirmBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async clickConfirmBookingButton(buttonName: string): Promise<void> {
    const confirmBtn = this.page.getByRole('button', { name: buttonName });
    if (await confirmBtn.isVisible({ timeout: 3000 })) {
      await confirmBtn.click();
      await this.page.waitForTimeout(500);
    }
  }          

  async fillUserDetailsForm(email: string, phoneNumber: string, firstName: string, lastName: string, age: number): Promise<void> {
    try {
      // Wait for page to be ready and stable
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await this.page.waitForTimeout(1000);
      
      // Debug: Check what's on the page
      const allLabels = await this.page.locator('label').allTextContents();
      console.log('Available labels on page:', allLabels);
      
      const allInputs = await this.page.locator('input').count();
      console.log('Number of input fields:', allInputs);
      
      // Try different selectors - check for input[name="..."]
      const emailInput = this.page.locator('input[name="email"], input[placeholder*="mail" i], input[id*="email" i]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill(email);
        console.log('Filled email');
      }
      
      await this.page.waitForTimeout(300);
      
      const phoneInput = this.page.locator('input[name="phone"], input[placeholder*="phone" i], input[id*="phone" i]').first();
      if (await phoneInput.count() > 0) {
        await phoneInput.fill(phoneNumber);
        console.log('Filled phone');
      }
      
      await this.page.waitForTimeout(300);
      
      const firstNameInput = this.page.locator('input[name="firstName"], input[name="first_name"], input[placeholder*="first" i], input[id*="firstName" i]').first();
      if (await firstNameInput.count() > 0) {
        await firstNameInput.fill(firstName);
        console.log('Filled firstName');
      }
      
      await this.page.waitForTimeout(300);
      
      const lastNameInput = this.page.locator('input[name="lastName"], input[name="last_name"], input[placeholder*="last" i], input[id*="lastName" i]').first();
      if (await lastNameInput.count() > 0) {
        await lastNameInput.fill(lastName);
        console.log('Filled lastName');
      }
      
      await this.page.waitForTimeout(300);
      
      const ageInput = this.page.locator('input[name="age"], input[placeholder*="age" i], input[id*="age" i]').first();
      if (await ageInput.count() > 0) {
        await ageInput.fill(age.toString());
        console.log('Filled age');
      }
      
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.error('Error filling user details form:', error);
      throw error;
    }
  }

  async clickContinuePaymentButton(buttonName: string): Promise<void> {
    const paymentBtn = this.page.getByRole('button', { name: buttonName });
    if (await paymentBtn.isVisible({ timeout: 3000 })) {
      await paymentBtn.click();
      await this.page.waitForTimeout(500);
    }
  } 
}
