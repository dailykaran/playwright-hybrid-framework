/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // User endpoints
  USERS: '/users',
  USER_BY_ID: (id: string | number) => `/users/${id}`,
  USER_SEARCH: '/users/search',
  
  // Order endpoints
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string | number) => `/orders/${id}`,
  USER_ORDERS: (userId: string | number) => `/users/${userId}/orders`,
  
  // Authentication endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string | number) => `/products/${id}`,
  PRODUCT_SEARCH: '/products/search'
};
