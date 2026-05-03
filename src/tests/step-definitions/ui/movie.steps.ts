import { When, Then, DataTable, defineParameterType } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@fixtures/world';
import { logger } from '@utils/logger/logger';
import { CommonHelpers } from '@utils/common/helpers';

// Define custom parameter types
defineParameterType({
  name: 'phoneNumber',
  regexp: /.*/,
  transformer: (s: string) => s,
});

defineParameterType({
  name: 'age',
  regexp: /.*/,
  transformer: (s: string) => s,
});


// Basic Navigation Steps
When('user navigates to movie page', async function (this: CustomWorld) {
  await this.moviePage.navigateToMoviePage();
  logger.info('User navigated to movie page');
});

Then('page header should contain {string}', async function (this: CustomWorld, movieName: string) {
  const isMovieInfoVisible = await this.moviePage.isMovieInformationVisible();
  expect(isMovieInfoVisible).toContain(movieName);
  logger.info(`Movie information visible: ${movieName}`);
  /* const movieInfo = await this.moviePage.getMovieInformation();
  logger.info(`Movie information visible: ${movieInfo}`); */
});

Then('movie image should be visible', async function (this: CustomWorld) {
  const isMovieImgVisible = await this.moviePage.isMovieImgVisible();
  expect(isMovieImgVisible).toBeTruthy();
  logger.info('Movie image is visible');
});

Then('now showing youtube should be visible', async function (this: CustomWorld) {
  const isYoutubeVisible = await this.moviePage.isYoutubeVisible();
  expect(isYoutubeVisible).toBeTruthy();
  logger.info('Now showing youtube is visible');
});

Then('the video player should be playable', async function (this: CustomWorld) {
  const isVideoPlayable = await this.moviePage.isVideoPlayable();
  expect(isVideoPlayable).toBeTruthy();
  logger.info('Video player is playable');
});

Then('user clicks on {string} button without selecting a showtime and verify alert message {string}', async function (this: CustomWorld, buttonName: string, expectedMessage: string) {
  const alertMessage = await this.moviePage.clickConfirmBookingWithoutSelectingShowtime(buttonName);
  logger.info(`User clicked on ${buttonName} button without selecting a showtime`);

  expect(alertMessage).toBe(expectedMessage);
  logger.info(`Alert popup message verified: ${alertMessage}`);
});

Then('user selects a {string} from the available options', async function (this: CustomWorld, showtime: string) {
  await this.moviePage.selectShowtime(showtime);
  logger.info(`User selected showtime: ${showtime}`);
});

Then('user clicks on {string} button', async function (this: CustomWorld, buttonName: string) {
  await this.moviePage.clickConfirmBookingButton(buttonName);
  await this.page.waitForURL('**/user-details', { timeout: 10000 });
  logger.info(`User clicked on ${buttonName} button`);
});

Then('the page redirects to the user details page', async function (this: CustomWorld) {
  const currentURL = await this.page.url();
  expect(currentURL).toContain('/user-details');
  logger.info('Page redirected to user details page');
});

Then('fill in user details with valid data', { timeout: 20000 }, async function (this: CustomWorld, dataTable: DataTable) {
  logger.info('Starting to fill user details form from DataTable');    
  // Verify page is still active
  if (!this.page || this.page.isClosed()) {
    throw new Error('Page is closed, cannot fill form');
  }
  
  logger.info(`Current URL before form fill: ${this.page.url()}`);
  
  // Extract data from DataTable using hashes() to get array of row objects
  const rows = dataTable.hashes();
  if (rows.length === 0) {
    throw new Error('No data rows found in DataTable');
  }
  
  const row = rows[0];
  const phoneNumber = row['phoneNumber']?.replace(/"/g, '')?.trim() || '';
  const age = parseInt(row['age']) || 0;
  
  const email = await this.dataFactory.generateEmail();
  const firstName = await this.dataFactory.generateFirstName();
  const lastName = await this.dataFactory.generateLastName();

  logger.info(`Filling form with phoneNumber: ${phoneNumber}, age: ${age}`);
  await this.moviePage.fillUserDetailsForm(email, phoneNumber, firstName, lastName, age);
  logger.info('User details form filled with valid data from DataTable');
});

Then('fill a {string} for user details', async function (this: CustomWorld, phoneNumber: string) {
  // Interpolate faker templates if present (e.g., {{phone.number()}})
  const interpolatedPhoneNumber = CommonHelpers.interpolateFakerTemplate(phoneNumber);
  
  await this.page.locator('input[name="phone"]').clear();
  await this.page.locator('input[name="phone"]').fill(interpolatedPhoneNumber);
  logger.info(`Filled phone number for user details: ${interpolatedPhoneNumber}`);
});


Then('user clicks on {string} button to continue payment', { timeout: 15000 }, async function (this: CustomWorld, buttonName: string) {
  await this.moviePage.clickContinuePaymentButton(buttonName);
  
  const smartWait = this.getSmartWait();
  await smartWait.waitForNetworkIdle(10000);
  logger.info(`User clicked on ${buttonName} button to continue payment`); 
  await smartWait.waitForUrl('**/payment', 10000);
  await expect(this.page.url()).toContain('/payment');
  logger.info('Page redirected to payment page');
});

