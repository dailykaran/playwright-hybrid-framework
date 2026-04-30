import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '@fixtures/world';
import { logger } from '@utils/logger/logger';

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
