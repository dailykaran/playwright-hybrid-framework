# Playwright Hybrid BDD Framework

A production-ready Playwright automation framework with BDD (Gherkin) support for UI and API testing.

## ? Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Run Tests

```bash
npm test                  # Run all tests
npm run test:ui           # UI tests only
npm run test:api          # API tests only
npm run test:smoke        # Smoke tests
npm run test:headed       # See browser in action
npm run test:debug        # Debug mode with Inspector
```

## ?? Project Structure

```
src/
+-- tests/                        # Feature files & step definitions
�   +-- ui/features/             # UI scenarios (.feature files)
�   +-- api/features/            # API scenarios (.feature files)
�   +-- step-definitions/        # Step implementations
+-- pages/                       # Page Object Model
�   +-- base/base.page.ts       # Base class with common methods
�   +-- modules/                # Page classes (one per page)
�   +-- components/             # Reusable UI components
+-- api/                        # API testing
�   +-- clients/api.client.ts  # HTTP client wrapper
�   +-- services/              # API service classes
�   +-- models/                # Data models
�   +-- validators/            # Response validators
+-- utils/                      # Utilities
�   +-- logger/                # Logging
�   +-- data/data-factory.ts  # Generate test data
�   +-- retry/                 # Retry flaky tests
�   +-- wait/                  # Smart element waits
+-- hooks/                      # Test lifecycle (Before/After)
+-- constants/                  # API endpoints & messages
+-- test-data/                  # JSON test data files
```

## ?? Writing Tests

### Create Feature File (Gherkin)

Create `src/tests/ui/features/login.feature`:

```gherkin
Feature: User Login
  @smoke @ui
  Scenario: Login with valid credentials
    When user navigates to login page
    And user enters username "testuser" and password "pass123"
    And user clicks login button
    Then user should see dashboard
```

### Create Step Definition

Create `src/tests/step-definitions/ui/login.steps.ts`:

```typescript
import { When, Then } from '@cucumber/cucumber';
import { LoginPage } from '@pages/modules/login.page';
import { CustomWorld } from '@fixtures/world';

When('user navigates to login page', async function (this: CustomWorld) {
  const page = new LoginPage(this.page);
  await page.navigateToLogin();
});

When('user enters username {string} and password {string}', 
  async function (this: CustomWorld, username: string, password: string) {
    const page = new LoginPage(this.page);
    await page.login(username, password);
  }
);
```

### Create Page Object

Create `src/pages/modules/login.page.ts`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

export class LoginPage extends BasePage {
  private usernameField = 'input#username';
  private passwordField = 'input#password';
  private loginBtn = 'button#login';
  private dashboard = 'div.dashboard';

  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin(): Promise<void> {
    await this.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.loginBtn);
  }

  async isDashboardVisible(): Promise<boolean> {
    return await this.page.locator(this.dashboard).isVisible();
  }
}
```

## ?? API Testing Example

### Create Feature File

Create `src/tests/api/features/users.feature`:

```gherkin
Feature: User API
  @api @smoke
  Scenario: Get all users
    When user calls GET "/users"
    Then response status is 200
    And response contains users array

  @api
  Scenario: Create user
    When user calls POST "/users" with:
      | username | john_doe      |
      | email    | john@test.com |
    Then response status is 201
```

### Create API Service

Create `src/api/services/user.service.ts`:

```typescript
import { ApiClient } from '../clients/api.client';

export class UserService {
  private apiClient = new ApiClient();

  async getUsers() {
    const response = await this.apiClient.get('/users');
    return response.data;
  }

  async createUser(userData: any) {
    const response = await this.apiClient.post('/users', userData);
    return response.data;
  }
}
```

## ??? Useful Utilities

### Generate Test Data

```typescript
import { DataFactory } from '@utils/data/data-factory';

const user = DataFactory.generateUser();
// Returns: { username, email, password, firstName, lastName }

const order = DataFactory.generateOrder();
// Returns: { items, totalAmount, shippingAddress }
```

### Logging

```typescript
import { logger } from '@utils/logger/logger';

logger.info('Test started');
logger.error('Something went wrong');
logger.debug('Debug info');
```

### Wait for Elements

```typescript
import { SmartWait } from '@utils/wait/smart-wait';

const smartWait = new SmartWait(page);
await smartWait.waitForElement('button.submit');
await smartWait.waitForText('div.success', 'Order placed');
```

### Retry Flaky Operations

```typescript
import { RetryHandler } from '@utils/retry/retry-handler';

const retry = new RetryHandler();
await retry.execute(
  async () => await element.click(),
  { maxRetries: 3, delayMs: 1000 }
);
```

## ?? Configuration

Set environment in `config/env/`:

```typescript
// config/env/qa.env.ts
export const qaEnv = {
  baseUrl: 'https://qa.example.com',
  apiBaseUrl: 'https://qa.example.com/api',
  timeout: 30000,
  headless: true,
  logLevel: 'info'
};
```

Use environment:

```bash
ENVIRONMENT=qa npm test
ENVIRONMENT=dev npm run test:headed
ENVIRONMENT=prod npm run test:smoke
```

## ?? View Reports

```bash
npm run reports:allure      # Allure interactive report
npm run reports:clean       # Clean old reports
```

Reports generated at:
- `reports/cucumber/` - Cucumber HTML report
- `reports/playwright/` - Playwright report
- `reports/failures/` - Failed test screenshots
- `logs/` - Execution logs

## ?? Advanced Commands

```bash
# Run specific tags
npm test -- --tags "@smoke"
npm test -- --tags "@ui and not @skip"

# Run specific feature
npm test -- src/tests/ui/features/login.feature

# Headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# Parallel execution
npm test -- --parallel 3

# Code quality
npm run lint           # Check code
npm run lint:fix       # Auto-fix
npm run format         # Format code
npm run type-check     # TypeScript check
```

## ?? Learn More

For architecture deep-dive and best practices, see **[FRAMEWORK_STUDY_GUIDE.md](./FRAMEWORK_STUDY_GUIDE.md)**

### Official Docs
- [Playwright Docs](https://playwright.dev)
- [Cucumber Docs](https://cucumber.io)
- [Allure Reports](https://docs.qameta.io/allure/)

## ?? Common Issues

| Issue | Solution |
|-------|----------|
| Browsers not found | Run `npx playwright install` |
| Element not found | Use `npm run test:headed` to debug or check selector |
| Timeout errors | Increase timeout in config or use SmartWait |
| API 401 errors | Set auth token: `apiClient.setAuthToken(token)` |

## ?? Tag Strategy

```gherkin
@smoke        # Critical paths (run always)
@regression   # Full test suite
@ui           # UI tests
@api          # API tests
@skip         # Skip this test
```

---

**For in-depth learning:** See [FRAMEWORK_STUDY_GUIDE.md](./FRAMEWORK_STUDY_GUIDE.md)

**Happy Testing! ??**
