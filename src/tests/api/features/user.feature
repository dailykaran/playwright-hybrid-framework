Feature: User API Endpoints
  As an API consumer
  I want to manage users through API endpoints
  So that I can create, read, update and delete users

  @api @smoke
  Scenario: Get all users
    When user calls GET endpoint "/users"
    Then response status should be 200
    And response should contain list of users

  @api @regression
  Scenario: Create a new user
    When user calls POST endpoint "/users" with user data:
      | username | email            | password  | firstName | lastName |
      | testuser | test@example.com | pass123   | John      | Doe      |
    Then response status should be 201
    And response should contain created user details

  @api
  Scenario: Get user by ID
    Given user has existing user ID "123"
    When user calls GET endpoint "/users/123"
    Then response status should be 200
    And response should contain user information
