import { AxiosResponse } from 'axios';
import { logger } from '@utils/logger/logger';

export class ResponseValidator {
  /**
   * Validate response status
   */
  static validateStatus(response: AxiosResponse, expectedStatus: number): boolean {
    const isValid = response.status === expectedStatus;
    if (isValid) {
      logger.info(`Status validation passed: ${response.status}`);
    } else {
      logger.error(
        `Status validation failed. Expected: ${expectedStatus}, Got: ${response.status}`
      );
    }
    return isValid;
  }

  /**
   * Validate response contains required fields
   */
  static validateRequiredFields(data: any, requiredFields: string[]): boolean {
    const missingFields = requiredFields.filter((field) => !(field in data));

    if (missingFields.length === 0) {
      logger.info('All required fields present in response');
      return true;
    } else {
      logger.error(`Missing fields in response: ${missingFields.join(', ')}`);
      return false;
    }
  }

  /**
   * Validate response data type
   */
  static validateDataType(data: any, expectedType: string): boolean {
    const actualType = typeof data;
    const isValid = actualType === expectedType;

    if (isValid) {
      logger.info(`Data type validation passed: ${actualType}`);
    } else {
      logger.error(`Data type validation failed. Expected: ${expectedType}, Got: ${actualType}`);
    }
    return isValid;
  }

  /**
   * Validate array response length
   */
  static validateArrayLength(data: any[], expectedLength: number): boolean {
    const isValid = data.length === expectedLength;

    if (isValid) {
      logger.info(`Array length validation passed: ${data.length}`);
    } else {
      logger.error(
        `Array length validation failed. Expected: ${expectedLength}, Got: ${data.length}`
      );
    }
    return isValid;
  }

  /**
   * Validate specific field value
   */
  static validateFieldValue(data: any, fieldPath: string, expectedValue: any): boolean {
    const actualValue = this.getNestedValue(data, fieldPath);
    const isValid = actualValue === expectedValue;

    if (isValid) {
      logger.info(`Field value validation passed: ${fieldPath} = ${expectedValue}`);
    } else {
      logger.error(
        `Field value validation failed. Field: ${fieldPath}, Expected: ${expectedValue}, Got: ${actualValue}`
      );
    }
    return isValid;
  }

  /**
   * Get nested object value by dot notation path
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Validate response contains all required fields and valid structure
   */
  static validateResponse(
    response: AxiosResponse,
    validation: {
      status?: number;
      requiredFields?: string[];
      dataType?: string;
      fieldValues?: { [key: string]: any };
    }
  ): boolean {
    let isValid = true;

    if (validation.status) {
      isValid = this.validateStatus(response, validation.status) && isValid;
    }

    const data = response.data;

    if (validation.requiredFields) {
      isValid = this.validateRequiredFields(data, validation.requiredFields) && isValid;
    }

    if (validation.dataType) {
      isValid = this.validateDataType(data, validation.dataType) && isValid;
    }

    if (validation.fieldValues) {
      for (const [field, value] of Object.entries(validation.fieldValues)) {
        isValid = this.validateFieldValue(data, field, value) && isValid;
      }
    }

    return isValid;
  }
}
