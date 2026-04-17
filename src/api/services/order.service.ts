import { ApiClient } from '../clients/api.client';
import { Order, CreateOrderRequest, UpdateOrderRequest } from '../models/order.model';
import { logger } from '@utils/logger/logger';

export class OrderService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Get all orders
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await this.apiClient.get<Order[]>('/orders');
      logger.info(`Retrieved ${response.data.length} orders`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get orders: ${error}`);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await this.apiClient.get<Order>(`/orders/${id}`);
      logger.info(`Retrieved order with ID: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get order ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await this.apiClient.post<Order>('/orders', orderData);
      logger.info(`Order created with ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create order: ${error}`);
      throw error;
    }
  }

  /**
   * Update order
   */
  async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await this.apiClient.patch<Order>(`/orders/${id}`, orderData);
      logger.info(`Order ${id} updated successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update order ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: number): Promise<void> {
    try {
      await this.updateOrder(id, { status: 'cancelled' });
      logger.info(`Order ${id} cancelled successfully`);
    } catch (error) {
      logger.error(`Failed to cancel order ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Get orders by user ID
   */
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      const response = await this.apiClient.get<Order[]>(`/users/${userId}/orders`);
      logger.info(`Retrieved ${response.data.length} orders for user ${userId}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get orders for user ${userId}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/orders/${id}`);
      logger.info(`Order ${id} deleted successfully`);
    } catch (error) {
      logger.error(`Failed to delete order ${id}: ${error}`);
      throw error;
    }
  }
}
