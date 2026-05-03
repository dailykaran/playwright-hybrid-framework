import { faker } from '@faker-js/faker';
import { logger } from '../logger/logger';
import { mainModule } from 'process';

export class DataFactory {
  /**
   * Generate random user data
   */
  static generateUser() {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: false }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: 'user' as const,
    };
    logger.info(`Generated user: ${user.username}`);
    return user;
  }

  /**
   * Generate random order data
   */
  static generateOrder() {
    const order = {
      items: [
        {
          productId: faker.number.int({ min: 1, max: 1000 }),
          quantity: faker.number.int({ min: 1, max: 10 }),
          price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        },
      ],
      totalAmount: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
      shippingAddress: faker.location.streetAddress(),
    };
    logger.info(`Generated order with total: ${order.totalAmount}`);
    return order;
  }

  /**
   * Generate random product data
   */
  static generateProduct() {
    const product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      category: faker.commerce.department(),
      stock: faker.number.int({ min: 0, max: 1000 }),
    };
    logger.info(`Generated product: ${product.name}`);
    return product;
  }

  /**
   * Generate random email
   */
  async generateEmail(): Promise<string> {
    return faker.internet.email();
  }

  /**
   * Generate random password
   */
  async generatePassword(length = 12): Promise<string> {
    return faker.internet.password({ length, memorable: false });
  }

  /**
   * Generate random phone number
   */
  async generatePhoneNumber(): Promise<string> {
    return faker.phone.number();
  }

  /**
   * Generate random address
   */
  async generateAddress(): Promise<string> {
    return faker.location.streetAddress();
  }

  /**
   * Generate random name
   */
  async generateName(): Promise<string> {
    return faker.person.fullName();
  }

  /**
   * Generate random number
   */
  async generateNumber(min: number, max: number): Promise<number> {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random string
   */
  async generateString(length: number): Promise<string> {
    return faker.string.alphanumeric(length);
  }

  async generateFirstName(): Promise<string> {
    return faker.person.firstName();
  }

  async generateLastName(): Promise<string> {
    return faker.person.lastName();
  }
  async generateAge(): Promise<number> {
    return faker.number.int({ min: 18, max: 80 });
  }
}