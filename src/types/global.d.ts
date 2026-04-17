/**
 * Global type definitions
 */

export interface TestUser {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'guest';
}

export interface TestOrder {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
  errors?: any;
}

export interface TestContext {
  page?: any;
  context?: any;
  browser?: any;
  testData: { [key: string]: any };
  apiResponse?: any;
  apiError?: any;
}

export interface Config {
  env: string;
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  headless: boolean;
  slowMo: number;
  screenshot: string;
  video: string;
  logLevel: string;
  isDebugMode: boolean;
}
