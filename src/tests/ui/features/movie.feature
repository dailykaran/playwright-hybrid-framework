Feature: TicketsVenue movie Page - Movie Booking Application
  As a movie enthusiast
  I want to view and book movie information
  So that I can book movie tickets at the cinema

  @ui
  Scenario: Verify movie page loads successfully with TicketsVenue branding
    When user navigates to movie page 
    Then page header should contain "Movie Synopsis" 
    And movie image should be visible

  @only-this @ui
  Scenario: Verify youtube trailer dialog
    When user navigates to movie page
    Then now showing youtube should be visible
    Then the video player should be playable 
    
