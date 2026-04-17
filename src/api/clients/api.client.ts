import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '@utils/logger/logger';
import { configManager } from '@utils/config/config-manager';

export class ApiClient {
  private baseUrl: string;
  private instance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = configManager.getApiBaseUrl();
    this.instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for logging
    this.instance.interceptors.response.use(
      (response) => {
        logger.info(`Response Status: ${response.status}`);
        return response;
      },
      (error) => {
        logger.error(`API Error: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    logger.info('Auth token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    delete this.instance.defaults.headers.common['Authorization'];
    logger.info('Auth token cleared');
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    logger.info(`GET request to: ${endpoint}`);
    return await this.instance.get<T>(endpoint, config);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    logger.info(`POST request to: ${endpoint}`);
    return await this.instance.post<T>(endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    logger.info(`PUT request to: ${endpoint}`);
    return await this.instance.put<T>(endpoint, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    logger.info(`PATCH request to: ${endpoint}`);
    return await this.instance.patch<T>(endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    logger.info(`DELETE request to: ${endpoint}`);
    return await this.instance.delete<T>(endpoint, config);
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get axios instance for custom requests
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}
