Feature: Order API Endpoints
  As an API consumer
  I want to manage orders through API endpoints
  So that I can create, read, update and delete orders

  @api @smoke
  Scenario: Get all orders
    When user calls GET endpoint "/orders"
    Then response status should be 200
    And response should contain list of orders

  @api @regression
  Scenario: Create a new order
    When user calls POST endpoint "/orders" with order data
    Then response status should be 201
    And response should contain created order details

  @api
  Scenario: Get order by ID
    Given user has existing order ID "456"
    When user calls GET endpoint "/orders/456"
    Then response status should be 200
    And response should contain order information
