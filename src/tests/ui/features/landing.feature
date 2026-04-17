Feature: TicketsVenue Landing Page - Movie Booking Application
  As a movie enthusiast
  I want to view and book movie tickets
  So that I can enjoy movies at the cinema

  @smoke @ui @mandatory
  Scenario: Verify landing page loads successfully with TicketsVenue branding
    When user navigates to home page
    Then landing page should be displayed
    And page title should contain "TicketsVenue"
    And TicketsVenue logo should be visible

  @smoke @ui @mandatory
  Scenario: Verify Movie Showcase section is displayed
    When user navigates to home page
    Then movie showcase section should be visible
    And movie showcase heading should contain "Movie Viewer Showcase"
    And movie showcase iframe should be present
    And showcase iframe features should be described

  @smoke @ui @mandatory
  Scenario: Verify Now Showing movies are displayed
    When user navigates to home page
    Then now showing section should be visible
    And now showing heading should be displayed
    And movie cards should be visible
    And at least 6 movie cards should be available

  
  @ui
  Scenario: Verify movie card details are complete
    When user navigates to home page
    Then each movie card should have:
      | detail     |
      | movie image |
      | movie title |
      | movie description |
      | duration |
      | price |
      | book button |

  @only-this @ui 
  Scenario: Verify search functionality for movies
    When user navigates to home page
    Then search box should be visible
    And search placeholder should contain "Search"
    When user enters "Inception" in search box
    Then search should filter movie results

  @ui @mandatory
  Scenario: Verify Book Now button is clickable on all movies
    When user navigates to home page
    Then each movie should have a clickable "Book Now" button
    And book button should be visible for all movies

  @regression @ui
  Scenario: Verify movie pricing information
    When user navigates to home page
    Then each movie should display a price
    And prices should be in valid currency format

  @regression @ui
  Scenario: Verify movie duration information
    When user navigates to home page
    Then each movie should display duration in minutes
    And duration information should be visible for all movies
  
  @ui
  Scenario: Verify responsive design on mobile viewport
    When user navigates to home page
    And user resizes viewport to mobile size
    Then landing page should adapt to mobile view
    And movie cards should be responsive on mobile

