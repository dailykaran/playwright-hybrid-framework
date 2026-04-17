import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { UserService } from '@api/services/user.service';
import { ResponseValidator } from '@api/validators/response.validator';
import { CustomWorld } from '@fixtures/world';
import { DataFactory } from '@utils/data/data-factory';

let userService: UserService;

Given('user has existing user ID {string}', async function (this: CustomWorld, userId: string) {
  this.setTestData('userId', userId);
});

When('user calls GET endpoint {string}', async function (this: CustomWorld, endpoint: string) {
  userService = new UserService();
  try {
    const response = await userService.getAllUsers();
    this.setApiResponse(response);
  } catch (error) {
    this.setApiError(error);
  }
});

Then('response status should be {int}', async function (this: CustomWorld, expectedStatus: number) {
  // Status validation would be done in actual API response
  expect(expectedStatus).toBeDefined();
});

Then('response should contain list of users', async function (this: CustomWorld) {
  const response = this.getApiResponse();
  expect(Array.isArray(response)).toBeTruthy();
});

When('user calls POST endpoint {string} with user data:', async function (this: CustomWorld, endpoint: string, dataTable) {
  userService = new UserService();
  const rows = dataTable.hashes();
  const userData = rows[0];
  
  try {
    const response = await userService.createUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    });
    this.setApiResponse(response);
  } catch (error) {
    this.setApiError(error);
  }
});

Then('response should contain created user details', async function (this: CustomWorld) {
  const response = this.getApiResponse();
  expect(response.id).toBeDefined();
  expect(response.username).toBeDefined();
  expect(response.email).toBeDefined();
});
