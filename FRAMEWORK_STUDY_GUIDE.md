# Playwright Hybrid BDD Framework - Study Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Folder Structure Deep Dive](#folder-structure-deep-dive)
4. [Core Technologies](#core-technologies)
5. [Module Breakdown](#module-breakdown)
6. [Configuration Guide](#configuration-guide)
7. [Test Execution Flow](#test-execution-flow)
8. [Best Practices](#best-practices)

---

## Project Overview

### What is This Framework?
A **hybrid Playwright automation framework** that combines:
- **BDD (Behavior-Driven Development)** testing using Gherkin syntax
- **UI testing** with Playwright
- **API testing** with Axios
- **Page Object Model (POM)** pattern for maintainability
- **Service Layer** for API interactions

### Key Characteristics
- **Multi-browser support**: Chromium, Firefox, WebKit
- **Scalable architecture**: Easy to add new tests and pages
- **Comprehensive reporting**: Allure, Cucumber HTML, Playwright reports
- **Robust utilities**: Logging, data generation, retry logic, smart waits
- **Environment management**: Dev, QA, Production configurations
- **Type-safe**: Full TypeScript support with strict mode enabled

---

## Architecture & Design Patterns

### 1. Page Object Model (POM)
Used for UI testing to separate test logic from element interactions.

```
pages/
├── base/base.page.ts          # Base class with common methods
├── modules/                    # Page classes for specific pages
│   └── landing.page.ts        # LandingPage class
└── components/                 # Reusable UI components
    ├── header.component.ts
    └── footer.component.ts
```

**Benefits**:
- Easier to maintain (changes in one place)
- Reusable methods
- Better readability in step definitions
- Reduces code duplication

### 2. Service Layer Pattern
Used for API testing to encapsulate business logic.

```
api/
├── clients/api.client.ts      # HTTP client (Axios wrapper)
├── services/                   # Business logic services
│   ├── user.service.ts        # User API operations
│   └── order.service.ts       # Order API operations
├── models/                     # Data models/interfaces
│   ├── user.model.ts
│   └── order.model.ts
└── validators/                 # Response validation
    └── response.validator.ts
```

### 3. World/Context Pattern
Cucumber's World object to share data across steps.

```
fixtures/
└── world.ts                   # CustomWorld class with shared context
```

### 4. Hook Pattern
Lifecycle hooks for setup and teardown.

```
hooks/
├── global.hooks.ts            # Global before/after
├── ui.hooks.ts                # UI-specific setup
└── api.hooks.ts               # API-specific setup
```

### 5. Factory Pattern
Data generation for test inputs.

```
utils/
└── data/data-factory.ts       # Faker-based data generation
```

---

## Folder Structure Deep Dive

### Root Level
| File/Folder | Purpose |
|---|---|
| `package.json` | NPM dependencies and scripts |
| `tsconfig.json` | TypeScript configuration with path aliases |
| `cucumber.config.cjs` | Cucumber main config |
| `cucumber.js` | Cucumber profiles (ui, api, all) |
| `playwright.config.js` | Playwright browser configuration |
| `.eslintrc.json` | Code linting rules |
| `prettier.config.json` | Code formatting rules |

### `/config` - Configuration Management

**Purpose**: Centralized configuration for different environments

```
config/
├── index.ts                    # Main config export
├── cucumber.config.ts          # Cucumber configuration
└── env/
    ├── dev.env.ts             # Development environment variables
    ├── qa.env.ts              # QA environment variables
    └── prod.env.ts            # Production environment variables
```

**Key Exports**:
- Base URL
- API endpoints
- Database credentials
- Feature flags
- Log levels
- Browser options

**Example Usage**:
```typescript
import { config } from '@config';
const baseUrl = config.baseUrl;  // Loaded based on ENVIRONMENT env var
```

### `/logs` - Test Execution Logs

**Purpose**: Store runtime logs during test execution

- Contains Winston logger output
- Timestamped log files
- Helpful for debugging failed tests
- Includes test names, steps, and assertions

**Log Levels**: error, warn, info, debug

### `/reports` - Test Reports

**Purpose**: Store various test reports and results

```
reports/
├── allure-report/              # Allure report HTML
├── allure-results/             # Raw Allure results (JSON)
├── cucumber/                   # Cucumber HTML reports
│   └── ui-report.html         # UI test report
├── failures/                   # Screenshots/videos of failures
└── playwright/                 # Playwright test results
```

**Report Types**:
- **Allure**: Rich interactive reports with timeline, history, and trend
- **Cucumber**: Feature-based HTML reports
- **Playwright**: Built-in test results with traces

### `/scripts` - Automation Scripts

**Purpose**: Helper scripts for development and CI/CD

```
scripts/
├── clean.sh                    # Clean reports and logs
└── run-tests.sh                # Run tests with specific parameters
```

### `/src` - Main Source Code

The heart of the framework. Let's break it down further:

#### `/src/api` - API Testing Layer

```
api/
├── clients/
│   └── api.client.ts          # Axios HTTP client wrapper
├── models/
│   ├── user.model.ts          # User data interface
│   └── order.model.ts         # Order data interface
├── services/
│   ├── user.service.ts        # User API operations (GET, POST, PUT, DELETE)
│   └── order.service.ts       # Order API operations
└── validators/
    └── response.validator.ts   # Validate API responses against models
```

**API Client** (`api.client.ts`):
- Wrapper around Axios
- Handles authentication tokens
- Manages request/response interceptors
- Base URL configuration
- Error handling

**Example**:
```typescript
const client = new ApiClient(baseUrl);
const response = await client.get('/users/1');
```

**Services** (`user.service.ts`, `order.service.ts`):
- High-level API operations
- Business logic encapsulation
- Methods like: createUser(), getUser(), updateUser(), deleteUser()

**Validators** (`response.validator.ts`):
- Validates response structure
- Type checking
- Status code validation
- Error response handling

#### `/src/constants` - Application Constants

```
constants/
├── endpoints.ts                # API endpoints
└── messages.ts                 # Success/error messages
```

**Example**:
```typescript
export const ENDPOINTS = {
  USERS: '/users',
  ORDERS: '/orders',
  LOGIN: '/auth/login',
};
```

#### `/src/fixtures` - Cucumber Fixtures

```
fixtures/
└── world.ts                    # CustomWorld class
```

**CustomWorld** (`world.ts`):
- Shared context across steps
- Stores page objects
- Stores API clients
- Stores test data
- Methods: setTestData(), getTestData()

**Example Usage**:
```typescript
// In step definition
async function(this: CustomWorld) {
  const page = this.page;
  const testData = this.getTestData('userId');
}
```

#### `/src/hooks` - Test Lifecycle Hooks

```
hooks/
├── global.hooks.ts             # Global setup/teardown
├── ui.hooks.ts                 # UI test setup/teardown
└── api.hooks.ts                # API test setup/teardown
```

**Common Hooks**:
- **BeforeAll**: Initialize test environment once
- **Before**: Setup before each scenario
- **After**: Cleanup after each scenario (screenshots, logs)
- **AfterAll**: Teardown after all tests

#### `/src/pages` - UI Page Objects

```
pages/
├── base/
│   └── base.page.ts           # Base page class with common methods
├── modules/
│   └── landing.page.ts        # Specific page classes (extends BasePage)
└── components/
    ├── header.component.ts     # Reusable header component
    └── footer.component.ts     # Reusable footer component
```

**BasePage** (`base.page.ts`):
- Constructor takes Playwright Page object
- Common methods: navigate(), click(), fill(), getText(), etc.
- Wait strategies
- Element visibility checks
- Logging

**Page Modules** (`landing.page.ts`):
- Extends BasePage
- Page-specific element selectors
- Page-specific methods
- Business logic for that page

**Example**:
```typescript
export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToHome() {
    await this.navigate('/');
  }

  async searchMovie(query: string) {
    await this.fill(this.selectors.searchBox, query);
  }
}
```

#### `/src/test-data` - External Test Data

```
test-data/
├── config/
│   └── test-config.json       # Test configuration
├── orders/
│   └── orders.json            # Order test data
└── users/
    └── users.json             # User test data
```

**Purpose**:
- External test data files (JSON)
- Loaded at runtime
- Easier to manage test data separately
- Can be updated without code changes

#### `/src/tests` - BDD Test Cases

```
tests/
├── api/
│   └── features/
│       ├── order.feature       # Order API test scenarios
│       └── user.feature        # User API test scenarios
├── step-definitions/
│   ├── api/
│   │   ├── order.steps.ts     # Order API step implementations
│   │   └── user.steps.ts      # User API step implementations
│   └── ui/
│       └── landing.steps.ts    # Landing page UI step implementations
└── ui/
    └── features/
        └── landing.feature     # Landing page test scenarios
```

**Feature Files** (`.feature`):
- Written in Gherkin syntax
- Human-readable test scenarios
- Organized by feature
- Include Given/When/Then statements
- Tagged with @ui, @api, @smoke, @regression, etc.

**Example**:
```gherkin
@ui @smoke
Feature: Landing Page
  
  Scenario: User navigates to landing page
    Given user navigates to home page
    Then landing page should be displayed
```

**Step Definitions** (`.steps.ts`):
- Implementation of Gherkin steps
- Maps steps to actual code
- Uses page objects or services
- Asserts expected behavior

**Example**:
```typescript
When('user enters {string} in search box', async function (this: CustomWorld, searchQuery: string) {
  const landingPage = new LandingPage(this.page);
  await landingPage.searchMovie(searchQuery);
  logger.info(`User searched for: ${searchQuery}`);
});
```

#### `/src/types` - TypeScript Type Definitions

```
types/
└── global.d.ts                 # Global type definitions and interfaces
```

**Example**:
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

#### `/src/utils` - Utility Functions

```
utils/
├── api/
│   └── api-helper.ts           # API-related helper functions
├── common/
│   └── helpers.ts              # General utility functions
├── config/
│   └── config-manager.ts       # Configuration loader
├── data/
│   └── data-factory.ts         # Faker-based test data generation
├── logger/
│   └── logger.ts               # Winston logger setup
├── retry/
│   └── retry-handler.ts        # Retry logic for flaky tests
└── wait/
    └── smart-wait.ts           # Intelligent wait strategies
```

##### Logger (`utils/logger/logger.ts`)
- Winston logger configuration
- Different log levels: error, warn, info, debug
- File and console outputs
- Timestamped logs

**Example**:
```typescript
logger.info('User logged in successfully');
logger.error('Test failed', error);
```

##### Data Factory (`utils/data/data-factory.ts`)
- Faker.js integration
- Generate fake names, emails, addresses, etc.
- Consistent test data
- Reduces hardcoding

**Example**:
```typescript
const user = DataFactory.createUser();
// { name: 'John Doe', email: 'john@example.com' }
```

##### Retry Handler (`utils/retry/retry-handler.ts`)
- Retry failed operations
- Exponential backoff
- Configurable attempts
- Handles flaky tests

**Example**:
```typescript
await retryHandler.retry(async () => {
  return await page.click('button');
}, 3);
```

##### Smart Wait (`utils/wait/smart-wait.ts`)
- Intelligent waiting for elements
- Wait for visibility, existence, text change
- Timeout handling
- Better than hardcoded sleeps

**Example**:
```typescript
await smartWait.waitForElement(selector, 5000);
```

##### Config Manager (`utils/config/config-manager.ts`)
- Load environment-specific configuration
- Merge configurations
- Validate required settings
- Export as singleton

**Example**:
```typescript
const config = ConfigManager.getConfig();
const baseUrl = config.baseUrl;
```

#### `/src/setup.ts` - Framework Initialization

- Global setup/teardown
- Initialize logger
- Load configuration
- Setup hooks
- Configure Playwright

---

## Core Technologies

### Testing Framework
- **Playwright**: Modern browser automation (v1.48.0)
- **Cucumber**: BDD test runner (v10.0.0)
- **@playwright/test**: Built-in assertions and utilities

### Languages & Tools
- **TypeScript**: Type-safe code with strict mode
- **Axios**: HTTP client for API testing
- **Winston**: Logging framework
- **Faker.js**: Test data generation
- **Allure**: Rich test reporting
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Configuration Files
- `tsconfig.json`: TypeScript config with path aliases (@pages, @fixtures, etc.)
- `cucumber.config.cjs`: Cucumber profiles and settings
- `playwright.config.js`: Playwright configuration
- `package.json`: Dependencies and scripts

---

## Module Breakdown

### How to Add a New UI Test

1. **Create Feature File** (`src/tests/ui/features/mypage.feature`)
   ```gherkin
   @ui @smoke
   Feature: My Page
     
     Scenario: User does something
       Given user navigates to my page
       Then my page should be displayed
   ```

2. **Create Page Object** (`src/pages/modules/my.page.ts`)
   ```typescript
   export class MyPage extends BasePage {
     // Selectors
     // Methods
   }
   ```

3. **Create Step Definitions** (`src/tests/step-definitions/ui/my.steps.ts`)
   ```typescript
   When('user navigates to my page', async function (this: CustomWorld) {
     const myPage = new MyPage(this.page);
     await myPage.navigateToPage();
   });
   ```

4. **Run Tests**
   ```bash
   npm run test:ui
   ```

### How to Add a New API Test

1. **Create Model** (`src/api/models/mymodel.model.ts`)
   ```typescript
   export interface MyModel {
     id: number;
     name: string;
   }
   ```

2. **Create Service** (`src/api/services/mymodel.service.ts`)
   ```typescript
   export class MyModelService {
     constructor(private client: ApiClient) {}
     
     async getMyModel(id: number): Promise<MyModel> {
       // API call
     }
   }
   ```

3. **Create Feature File** (`src/tests/api/features/mymodel.feature`)
   ```gherkin
   @api @smoke
   Feature: MyModel API
     
     Scenario: Get MyModel
       When user fetches mymodel with id 1
       Then response should have status 200
   ```

4. **Create Step Definitions** (`src/tests/step-definitions/api/mymodel.steps.ts`)

5. **Run Tests**
   ```bash
   npm run test:api
   ```

---

## Configuration Guide

### Environment Variables
Create `.env` file in root:
```env
ENVIRONMENT=dev
BROWSER=chromium
LOG_LEVEL=info
HEADED=false
SLOW_MO=0
TIMEOUT=30000
```

### Environment Configs (`config/env/`)
Each environment has configuration:
```typescript
// config/env/dev.env.ts
export const devEnv = {
  baseUrl: 'https://dev.example.com',
  apiBaseUrl: 'https://dev.example.com/api',
  credentials: {
    username: 'dev_user',
    password: 'dev_password',
  },
};
```

### Running Tests for Specific Environment
```bash
ENVIRONMENT=qa npm run test:ui
ENVIRONMENT=prod npm run test:api
```

---

## Test Execution Flow

### 1. Test Discovery
- Cucumber finds `.feature` files
- Loads matching step definitions
- Registers hooks

### 2. Hook Execution
```
BeforeAll (once)
  ↓
For each Scenario:
  Before (setup)
    ↓
  Step 1 (When)
    ↓
  Step 2 (Then)
    ↓
  After (cleanup, screenshots)
  ↓
AfterAll (teardown)
```

### 3. Step Execution
- Cucumber finds matching step definition
- Calls the function
- Steps can access CustomWorld (`this`)
- Logs output to logger
- Takes screenshots on failure

### 4. Report Generation
```
Allure Report (interactive)
Cucumber Report (HTML)
Playwright Report
Log Files
Screenshots (on failure)
```

---

## Best Practices

### 1. Writing Steps
✅ **DO**:
- Use clear, business-readable language
- One action per step
- Reuse existing steps
- Use page objects

❌ **DON'T**:
- Create new steps for similar functionality
- Mix multiple actions in one step
- Use technical details in step text
- Hardcode values

### 2. Page Objects
✅ **DO**:
- One page per class
- Group related methods
- Use descriptive selector names
- Extend BasePage
- Add documentation

❌ **DON'T**:
- Mix page logic with test logic
- Use ambiguous selector names
- Hardcode element selectors
- Add unrelated methods

### 3. API Testing
✅ **DO**:
- Use services for API calls
- Validate response structure
- Use models/interfaces
- Log requests/responses
- Handle errors gracefully

❌ **DON'T**:
- Make raw axios calls in steps
- Skip response validation
- Ignore error responses
- Hardcode endpoints

### 4. Data Management
✅ **DO**:
- Use DataFactory for test data
- Store data in CustomWorld
- Use external test data files
- Clean up test data after tests

❌ **DON'T**:
- Hardcode test data in steps
- Create test data manually
- Reuse data across tests
- Leave test data in database

### 5. Waiting & Waits
✅ **DO**:
- Use SmartWait for element waits
- Set appropriate timeouts
- Wait for visibility, not just existence
- Log wait actions

❌ **DON'T**:
- Use hardcoded `wait(5000)` calls
- Wait indefinitely
- Wait for elements that might not appear
- Wait silently without logging

### 6. Logging
✅ **DO**:
- Log important actions
- Log step start/end
- Log assertions
- Use appropriate log levels

❌ **DON'T**:
- Over-log (info level for everything)
- Forget to log
- Log sensitive data
- Use console.log()

### 7. Error Handling
✅ **DO**:
- Catch and log errors
- Provide meaningful error messages
- Take screenshots on failure
- Retry flaky operations

❌ **DON'T**:
- Ignore errors silently
- Generic error messages
- Let tests fail without evidence
- Never retry

---

## NPM Scripts Reference

| Script | Purpose |
|---|---|
| `npm test` | Run all tests |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:all` | Run all tests (explicit) |
| `npm run test:headed` | Run UI tests in headed mode |
| `npm run test:debug` | Run with Playwright inspector |
| `npm run test:smoke` | Run tests tagged @smoke |
| `npm run test:regression` | Run tests tagged @regression |
| `npm run reports:allure` | View Allure report |
| `npm run reports:clean` | Clean all reports |
| `npm run clean` | Clean reports and logs |
| `npm run lint` | Check code for errors |
| `npm run lint:fix` | Auto-fix code errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

---

## Quick Reference

### Running Specific Tests
```bash
# Single feature file
npm run test:ui -- src/tests/ui/features/landing.feature

# By tag
npm run test:ui -- --tags "@smoke"

# By tag (multiple)
npm run test:ui -- --tags "@smoke and @ui"

# Specific scenario
npm run test:ui -- src/tests/ui/features/landing.feature --name "User navigates"
```

### Debugging
```bash
# Run with Playwright inspector
npm run test:debug

# Run in headed mode
npm run test:headed

# Run with logging
LOGLEVEL=debug npm run test:ui
```

### Path Aliases
Available in TypeScript (configured in `tsconfig.json`):
- `@config` → `config/`
- `@pages` → `src/pages/`
- `@fixtures` → `src/fixtures/`
- `@hooks` → `src/hooks/`
- `@utils/*` → `src/utils/*`
- `@constants` → `src/constants/`
- `@types` → `src/types/`
- `@api` → `src/api/`
- `@services` → `src/api/services/`
- `@models` → `src/api/models/`

### Port Forwarding for Local Testing
If testing local application:
```bash
# Terminal 1 - Start your app
npm start

# Terminal 2 - Run tests
npm run test:ui
```

---

## Troubleshooting

### Common Issues

**Issue**: "Element not found"
- Check selector accuracy
- Use SmartWait instead of hardcoded waits
- Verify element visibility

**Issue**: "Test timeout"
- Increase timeout in playwright.config.js
- Check element loading
- Use logging to find bottlenecks

**Issue**: "API request failed"
- Verify API endpoint
- Check authentication headers
- Review request/response in logs

**Issue**: "Tests work locally but fail in CI"
- Check environment configuration
- Verify CI environment variables
- Add more robust waiting

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Gherkin Syntax Guide](https://cucumber.io/docs/gherkin/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Winston Logger](https://github.com/winstonjs/winston)
- [Allure Reports](https://docs.qameta.io/allure/)

---

**Created**: April 17, 2026  
**Framework Version**: 1.0.0  
**Last Updated**: April 17, 2026
