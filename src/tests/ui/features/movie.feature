Feature: TicketsVenue movie Page - Movie Booking Application
  As a movie enthusiast
  I want to view and book movie information
  So that I can book movie tickets at the cinema

  @ui
  Scenario: Verify movie page loads successfully with TicketsVenue branding
    When user navigates to movie page 
    Then page header should contain "Movie Synopsis" 
    And movie image should be visible

  @ui
  Scenario: Verify youtube trailer dialog
    When user navigates to movie page
    Then now showing youtube should be visible
    Then the video player should be playable 

  @ui  
  Scenario: Verify alert popup when clicking the "Confirm Booking" button without selecting a showtime
    When user navigates to movie page
    Then page header should contain "Movie Synopsis"
    And user clicks on "Confirm Booking" button without selecting a showtime and verify alert message "Please select a showtime"

  @only-this @ui
  Scenario: Verify showtime selection and booking process 
    When user navigates to movie page
    Then page header should contain "Movie Synopsis"
    And user selects a "21:30" from the available options
    And user clicks on "Confirm Booking" button
    Then the page redirects to the user details page
    And fill in user details with valid data
        | phoneNumber   | age |
        |  "1234567890" | 25 |
    And fill a "{{phone.number()}}" for user details
    And user clicks on "Continue to Payment" button to continue payment
   
    