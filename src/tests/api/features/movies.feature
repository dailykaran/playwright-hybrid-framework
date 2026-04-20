Feature: Movies API Endpoints
  As an API consumer
  I want to manage movies through API endpoints
  So that I can create, read, update and delete movies

  @api @smoke
  Scenario: Get all movies
    When user calls GET endpoint "/movies"
    Then response status should be 200
    And response should contain list of movies

  @api @regression
  Scenario: Create a new movie
    When user calls POST endpoint "/movies" with movie data:
      | title | genre | releaseYear | directedBy | runtime |
      | Inception | Sci-Fi | 2010 | Christopher Nolan | 148 |
    Then response status should be 201
    And response should contain created movie details

  @api @regression
  Scenario: Get movie by ID
    When user calls POST endpoint "/movies" with movie data:
      | title | genre | releaseYear | directedBy | runtime |
      | Interstellar | Sci-Fi | 2014 | Christopher Nolan | 169 |
    Then response status should be 201
    When user calls GET endpoint with the created movie ID
    Then response status should be 200
    And response should contain movie information

  @api @regression
  Scenario: Update movie information
    When user calls POST endpoint "/movies" with movie data:
      | title | genre | releaseYear | directedBy | runtime |
      | The Matrix | Sci-Fi | 1999 | Lana Wachowski | 136 |
    Then response status should be 201
    When user calls PUT endpoint with the created movie ID and movie data:
      | rating |
      | 8.8 |
    Then response status should be 200
    And response should contain updated movie details

  @api @regression
  Scenario: Delete movie
    When user calls POST endpoint "/movies" with movie data:
      | title | genre | releaseYear | directedBy | runtime |
      | Tenet | Sci-Fi | 2020 | Christopher Nolan | 150 |
    Then response status should be 201
    When user calls DELETE endpoint with the created movie ID
    Then response status should be 204
