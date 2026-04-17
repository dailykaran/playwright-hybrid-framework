# Playwright BDD Framework

A comprehensive hybrid Playwright automation framework built with BDD (Behavior-Driven Development) approach, supporting both UI and API testing.

## 📋 Features

- **BDD Testing**: Written in Gherkin language for better readability
- **Hybrid Framework**: Supports both UI and API automation
- **Page Object Model**: Organized page classes for better maintainability
- **Cucumber Integration**: Complete BDD support with Cucumber.js
- **Multi-browser Support**: Chromium, Firefox, and WebKit
- **API Testing**: Comprehensive REST API testing with axios
- **Reporting**: Allure reports, Cucumber HTML reports, and Playwright reports
- **Retry Logic**: Smart retry mechanism for flaky tests
- **Logging**: Comprehensive logging with Winston
- **Data Factory**: Faker integration for test data generation
- **CI/CD Integration**: GitHub Actions workflow included

## 📁 Project Structure

```
playwright-bdd-framework/
├── .github/workflows/          # CI/CD pipelines
├── config/                     # Configuration files
│   ├── env/                   # Environment-specific configs
│   ├── playwright.config.ts   # Playwright configuration
│   └── cucumber.config.ts     # Cucumber configuration
├── src/
│   ├── tests/                 # Test layer (BDD)
│   │   ├── ui/features/       # UI feature files
│   │   ├── api/features/      # API feature files
│   │   └── step-definitions/  # Step implementations
│   ├── pages/                 # UI Page Objects
│   │   ├── base/              # Base page class
│   │   ├── modules/           # Page modules
│   │   └── components/        # Reusable components
│   ├── api/                   # API Layer
│   │   ├── clients/           # API client
│   │   ├── services/          # API services
│   │   ├── models/            # Data models
│   │   └── validators/        # Response validators
│   ├── fixtures/              # Test fixtures
│   ├── hooks/                 # Test lifecycle hooks
│   ├── utils/                 # Utility functions
│   ├── test-data/             # External test data
│   ├── constants/             # Constants and endpoints
│   └── types/                 # TypeScript type definitions
├── reports/                   # Test reports
├── logs/                      # Test execution logs
└── scripts/                   # Automation scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright-bdd-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Configuration

1. **Set Environment Variables**

Create a `.env` file in the root directory:

```env
ENVIRONMENT=dev
BROWSER=chromium
LOG_LEVEL=info
DEBUG=false
```

2. **Update Environment Configs**

Edit the configuration files in `config/env/` for your target environments:

```typescript
// config/env/qa.env.ts
export const qaEnv = {
  baseUrl: 'https://qa.example.com',
  apiBaseUrl: 'https://qa.example.com/api',
  // ...
};
```

## 📝 Writing Tests

### Feature File Example

```gherkin
Feature: User Login
  As a user
  I want to login to the application
  So that I can access the dashboard

  @smoke @ui
  Scenario: Successful login with valid credentials
    Given user navigates to login page
    When user enters username "testuser" and password "password123"
    And user clicks login button
    Then user should be redirected to dashboard
```

### Step Definition Example

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '@pages/modules/login.page';
import { CustomWorld } from '@fixtures/world';

Given('user navigates to login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
});

When('user enters username {string} and password {string}', 
  async function (this: CustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
  }
);
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run UI Tests Only

```bash
npm run test:ui
```

### Run API Tests Only

```bash
npm run test:api
```

### Run Tests with Specific Tags

```bash
npm test -- --tags "@smoke"
npm test -- --tags "@regression"
```

### Run in Headed Mode

```bash
npm run test:headed
```

### Run in Debug Mode

```bash
npm run test:debug
```

### Run Smoke Tests

```bash
npm run test:smoke
```

### Run Regression Tests

```bash
npm run test:regression
```

## 📊 Reports

### Allure Reports

Generate and view Allure reports:

```bash
npm run reports:allure
```

### Cucumber HTML Reports

Reports are automatically generated at: `reports/cucumber/cucumber-report.html`

### Playwright Reports

Reports are automatically generated at: `reports/playwright/index.html`

## 🛠️ Utilities

### Logger

```typescript
import { logger } from '@utils/logger/logger';

logger.info('Test message');
logger.error('Error message');
logger.warn('Warning message');
```

### Data Factory

```typescript
import { DataFactory } from '@utils/data/data-factory';

const user = DataFactory.generateUser();
const order = DataFactory.generateOrder();
const email = DataFactory.generateEmail();
```

### Retry Handler

```typescript
import { RetryHandler } from '@utils/retry/retry-handler';

const retryHandler = new RetryHandler();
await retryHandler.execute(
  async () => { 
    // Some flaky operation 
  },
  { maxRetries: 3, delayMs: 1000 }
);
```

### Smart Wait

```typescript
import { SmartWait } from '@utils/wait/smart-wait';

const smartWait = new SmartWait(page);
await smartWait.waitForElement(selector);
await smartWait.waitForText(selector, 'expected text');
```

## 🔗 API Testing

### Create API Service

```typescript
import { ApiClient } from '@api/clients/api.client';
import { logger } from '@utils/logger/logger';

const apiClient = new ApiClient();
apiClient.setAuthToken('your-token');

const response = await apiClient.get('/users');
```

### Validate Responses

```typescript
import { ResponseValidator } from '@api/validators/response.validator';

ResponseValidator.validateResponse(response, {
  status: 200,
  requiredFields: ['id', 'name', 'email'],
  fieldValues: { 'status': 'active' }
});
```

## 📈 Best Practices

1. **Use Page Object Model**: Keep page elements and methods organized in page classes
2. **Meaningful Step Definitions**: Write step definitions that business users can understand
3. **Test Data Management**: Use DataFactory for generating test data
4. **Error Handling**: Implement proper error handling and logging
5. **Wait Strategies**: Use SmartWait for reliable element waiting
6. **Tagging**: Tag scenarios for easy filtering and execution
7. **Parallel Execution**: Configure parallel execution for faster test runs
8. **Clean Code**: Follow TypeScript best practices and ESLint rules

## 🔄 CI/CD Integration

The framework includes GitHub Actions workflow for automated testing:

- Runs on push and pull requests
- Tests multiple Node versions (18.x, 20.x)
- Tests across all browsers (Chromium, Firefox, WebKit)
- Generates and uploads test reports
- Posts test results to pull requests

### Triggering CI/CD

```bash
# Trigger on push to main/develop
git push origin main

# Trigger on pull request
# Create a pull request to main/develop
```

## 📦 Project Dependencies

- **@playwright/test**: Playwright testing library
- **@cucumber/cucumber**: BDD framework
- **axios**: HTTP client for API testing
- **@faker-js/faker**: Test data generation
- **winston**: Logging library
- **typescript**: TypeScript compiler
- **allure-commandline**: Report generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Support

For questions or issues, please create an issue in the repository or contact the QA team.

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev)
- [Cucumber Documentation](https://cucumber.io/docs)
- [Allure Reports](https://docs.qameta.io/allure/)
- [Faker.js Documentation](https://fakerjs.dev/)

---

**Happy Testing! 🎉**
