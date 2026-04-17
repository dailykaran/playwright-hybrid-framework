import { ApiClient } from '../clients/api.client';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';
import { logger } from '@utils/logger/logger';

export class UserService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>('/users');
      logger.info(`Retrieved ${response.data.length} users`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get users: ${error}`);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await this.apiClient.get<User>(`/users/${id}`);
      logger.info(`Retrieved user with ID: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await this.apiClient.post<User>('/users', userData);
      logger.info(`User created with ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to create user: ${error}`);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await this.apiClient.put<User>(`/users/${id}`, userData);
      logger.info(`User ${id} updated successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/users/${id}`);
      logger.info(`User ${id} deleted successfully`);
    } catch (error) {
      logger.error(`Failed to delete user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>('/users/search', {
        params: { q: query }
      });
      logger.info(`Found ${response.data.length} users matching "${query}"`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to search users: ${error}`);
      throw error;
    }
  }
}
