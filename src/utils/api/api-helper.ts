import { ApiClient } from '@api/clients/api.client';
import { logger } from '../logger/logger';

export class ApiHelper {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Set bearer token for API requests
   */
  setBearerToken(token: string): void {
    this.apiClient.setAuthToken(token);
    logger.info('Bearer token set for API requests');
  }

  /**
   * Clear bearer token
   */
  clearBearerToken(): void {
    this.apiClient.clearAuthToken();
    logger.info('Bearer token cleared');
  }

  /**
   * Get default headers
   */
  getDefaultHeaders(): { [key: string]: string } {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Get custom headers with additional values
   */
  getCustomHeaders(customHeaders: { [key: string]: string }): { [key: string]: string } {
    return {
      ...this.getDefaultHeaders(),
      ...customHeaders,
    };
  }

  /**
   * Validate response status
   */
  validateResponseStatus(status: number, expectedStatus: number): boolean {
    const isValid = status === expectedStatus;
    logger.info(
      `Response status validation: Expected ${expectedStatus}, Got ${status} - ${isValid ? 'PASS' : 'FAIL'}`
    );
    return isValid;
  }

  /**
   * Format API endpoint URL
   */
  formatEndpoint(baseUrl: string, endpoint: string): string {
    const formattedUrl = `${baseUrl}${endpoint}`;
    logger.info(`Formatted endpoint URL: ${formattedUrl}`);
    return formattedUrl;
  }

  /**
   * Get API client instance
   */
  getApiClient(): ApiClient {
    return this.apiClient;
  }
}
