import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { OrderService } from '@api/services/order.service';
import { CustomWorld } from '@fixtures/world';
import { DataFactory } from '@utils/data/data-factory';

let orderService: OrderService;

Given('user has existing order ID {string}', async function (this: CustomWorld, orderId: string) {
  this.setTestData('orderId', orderId);
});

When('user calls GET endpoint {string}', async function (this: CustomWorld, endpoint: string) {
  orderService = new OrderService();
  try {
    const response = await orderService.getAllOrders();
    this.setApiResponse(response);
  } catch (error) {
    this.setApiError(error);
  }
});

Then('response should contain list of orders', async function (this: CustomWorld) {
  const response = this.getApiResponse();
  expect(Array.isArray(response)).toBeTruthy();
});

When('user calls POST endpoint {string} with order data', async function (this: CustomWorld, endpoint: string) {
  orderService = new OrderService();
  const orderData = DataFactory.generateOrder();
  orderData['userId'] = 1;
  
  try {
    const response = await orderService.createOrder(orderData as any);
    this.setApiResponse(response);
  } catch (error) {
    this.setApiError(error);
  }
});

Then('response should contain created order details', async function (this: CustomWorld) {
  const response = this.getApiResponse();
  expect(response.id).toBeDefined();
  expect(response.totalAmount).toBeDefined();
  expect(response.items).toBeDefined();
});

Then('response should contain order information', async function (this: CustomWorld) {
  const response = this.getApiResponse();
  expect(response.id).toBeDefined();
  expect(response.status).toBeDefined();
});
