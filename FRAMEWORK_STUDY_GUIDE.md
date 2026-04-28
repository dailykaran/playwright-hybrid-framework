# Playwright Hybrid BDD Framework - Complete Study Guide

## 📚 Table of Contents
1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Framework Architecture](#framework-architecture)
5. [Detailed Module Guide](#detailed-module-guide)
6. [Configuration & Setup](#configuration--setup)
7. [Test Development Workflow](#test-development-workflow)
8. [Best Practices & Patterns](#best-practices--patterns)
9. [Debugging & Troubleshooting](#debugging--troubleshooting)
10. [Resources & References](#resources--references)

---

## Quick Start

### Installation & Setup
```bash
# 1. Install dependencies
npm install

# 2. Set environment
set ENVIRONMENT=dev

# 3. Run tests
npm run test:ui              # UI tests only
npm run test:api             # API tests only
npm run test:all             # All tests
```

### Key NPM Commands
```bash
npm test                      # Default: run all tests
npm run test:ui -- --headed   # UI tests in headed mode (browser visible)
npm run test:debug            # Debug with Playwright Inspector
npm run test:smoke            # Run @smoke tagged tests
npm run reports:allure        # View Allure dashboard
npm run clean                 # Clean all reports and logs
```

---

## Project Overview

### Framework Identity
This is a **Hybrid BDD Automation Framework** combining:
- **Behavior-Driven Development (BDD)** using Gherkin syntax
- **UI Automation** with Playwright browser engine
- **API Testing** with Axios HTTP client
- **Page Object Model (POM)** for maintainability
- **Service Layer Pattern** for API abstraction
- **TypeScript** for type safety and IDE support

### Core Capabilities
| Feature | Implementation |
|---------|-----------------|
| **Multi-browser** | Chromium, Firefox, WebKit support |
| **Testing Types** | UI (Playwright) + API (Axios) |
| **Patterns** | POM, Service Layer, Factory, World Context |
| **Reporting** | Allure, Cucumber HTML, Playwright reports |
| **Utilities** | Logger, Data Factory, Retry Handler, Smart Waits |
| **Environments** | Dev, QA, Production configurations |
| **Type Safety** | Full TypeScript with strict mode |

### Project Statistics
- **Language**: TypeScript 5.x
- **Framework Version**: 1.0.0+
- **Test Runner**: Cucumber.js 10.x
- **Automation Tool**: Playwright 1.48.x
- **HTTP Client**: Axios 1.x
- **Logging**: Winston 3.x
- **Test Data**: Faker.js 8.x

---

## Architecture & Design Patterns

### 1. Page Object Model (POM)
**Purpose**: Separate page logic from test logic

**Structure**:
```
pages/
├── base/base.page.ts              # Common methods all pages inherit
├── modules/                        # Feature-specific pages
│   ├── landing.page.ts
│   ├── checkout.page.ts
│   └── account.page.ts
└── components/                     # Reusable UI components
    ├── header.component.ts
    ├── footer.component.ts
    └── navigation.component.ts
```

**Benefits**:
- Centralized element selectors (one place to update)
- Reusable methods across tests
- Clear separation of concerns
- Easier maintenance when UI changes

**Example Pattern**:
```typescript
// base.page.ts - Common methods
export class BasePage {
  protected page: Page;

  async navigate(path: string) { }
  async click(selector: string) { }
  async fill(selector: string, text: string) { }
  async getText(selector: string): Promise<string> { }
}

// landing.page.ts - Specific page
export class LandingPage extends BasePage {
  private selectors = {
    searchBox: 'input[placeholder="Search"]',
    searchButton: 'button[type="submit"]',
  };

  async searchMovie(query: string) {
    await this.fill(this.selectors.searchBox, query);
    await this.click(this.selectors.searchButton);
  }
}
```

### 2. Service Layer Pattern
**Purpose**: Encapsulate API business logic

**Structure**:
```
api/
├── clients/api.client.ts           # HTTP client wrapper
├── models/                          # Data interfaces
│   ├── user.model.ts
│   ├── movie.model.ts
│   └── order.model.ts
├── services/                        # Business operations
│   ├── user.service.ts
│   ├── movie.service.ts
│   └── order.service.ts
└── validators/                      # Response validation
    └── response.validator.ts
```

**Benefits**:
- Consistent API interactions
- Centralized error handling
- Easy to test and mock
- Authentication management in one place

**Example Pattern**:
```typescript
// api.client.ts - HTTP wrapper
export class ApiClient {
  async get(endpoint: string) { }
  async post(endpoint: string, data: any) { }
  async put(endpoint: string, data: any) { }
  async delete(endpoint: string) { }
}

// movie.service.ts - Business logic
export class MovieService {
  constructor(private client: ApiClient) {}

  async getMovies(page: number = 1): Promise<Movie[]> {
    return await this.client.get(`/movies?page=${page}`);
  }

  async createMovie(movie: Movie): Promise<Movie> {
    return await this.client.post('/movies', movie);
  }
}
```

### 3. World/Context Pattern
**Purpose**: Share data between BDD steps

**How It Works**:
```
Each Scenario
  ↓
New CustomWorld instance created
  ↓
Steps can access: page, apiClient, testData
  ↓
Scenario ends
  ↓
CustomWorld destroyed
```

**Example**:
```typescript
// fixtures/world.ts
export class CustomWorld {
  page: Page;
  apiClient: ApiClient;
  private testData: Map<string, any> = new Map();

  setTestData(key: string, value: any) {
    this.testData.set(key, value);
  }

  getTestData(key: string) {
    return this.testData.get(key);
  }
}

// In step definitions
When('I search for {string}', async function(this: CustomWorld, query: string) {
  this.setTestData('searchQuery', query);
  const page = new LandingPage(this.page);
  await page.search(query);
});

Then('I see search results', async function(this: CustomWorld) {
  const query = this.getTestData('searchQuery');
  // Verify results
});
```

### 4. Hook Pattern
**Purpose**: Setup and teardown before/after tests

**Lifecycle**:
```
BeforeAll Hook (once at start)
  ↓
┌─ For Each Scenario ─┐
│                     │
│ Before Hook         │
│ ↓                   │
│ Execute Steps       │
│ ↓                   │
│ After Hook          │
│                     │
└─────────────────────┘
  ↓
AfterAll Hook (once at end)
```

### 5. Factory Pattern
**Purpose**: Generate test data consistently

**Example**:
```typescript
// utils/data/data-factory.ts
export class DataFactory {
  static createUser(): User {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 65 })
    };
  }

  static createMovie(): Movie {
    return {
      title: faker.lorem.words(3),
      year: faker.number.int({ min: 2000, max: 2024 }),
      rating: faker.number.float({ min: 0, max: 10, precision: 0.1 })
    };
  }
}
```

---

## Framework Architecture

### High-Level Flow Diagram
```
Test Execution Starts
    ↓
Cucumber discovers .feature files
    ↓
BeforeAll hooks execute
    ↓
For each Scenario:
    ├→ Before hooks
    ├→ Step 1: Given (setup)
    ├→ Step 2: When (action)
    ├→ Step 3: Then (assertion)
    ├→ After hooks (cleanup, screenshots)
    ↓
AfterAll hooks execute
    ↓
Reports generated (Allure, Cucumber, Playwright)
```

### File Organization Philosophy
```
/src
├── /api              → API client, services, models (API testing)
├── /constants        → Shared constants across tests
├── /fixtures         → Cucumber World/Context setup
├── /hooks            → Before/After lifecycle hooks
├── /pages            → Page Objects (UI testing)
├── /test-data        → External test data (JSON, CSV)
├── /tests            → Feature files and step definitions
├── /types            → TypeScript interfaces and types
└── /utils            → Helpers and utilities
```

---

## Detailed Module Guide

### 1. API Module (`/src/api`)

#### API Client (`clients/api.client.ts`)
Wrapper around Axios for consistent HTTP interactions:

```typescript
// Usage example
const client = new ApiClient('https://api.example.com');

// Basic methods
await client.get('/users/1');                    // Fetch single user
await client.post('/users', userData);           // Create user
await client.put('/users/1', updatedData);       // Update user
await client.delete('/users/1');                 // Delete user

// Advanced features
client.setAuthToken('Bearer token123');          // Set auth header
client.setHeader('X-Custom', 'value');           // Set custom header
```

**Key Features**:
- Request/response interceptors
- Centralized error handling
- Authentication token management
- Request/response logging
- Timeout configuration

#### Services (`services/*.service.ts`)
High-level API operations encapsulating business logic:

```typescript
// Example: UserService
export class UserService {
  constructor(private client: ApiClient) {}

  async getUser(userId: number): Promise<User> {
    return await this.client.get(`/users/${userId}`);
  }

  async getAllUsers(page: number = 1): Promise<User[]> {
    return await this.client.get(`/users?page=${page}`);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.client.post('/users', user);
  }

  async updateUser(userId: number, updates: UpdateUserDto): Promise<User> {
    return await this.client.put(`/users/${userId}`, updates);
  }

  async deleteUser(userId: number): Promise<void> {
    return await this.client.delete(`/users/${userId}`);
  }
}
```

#### Models (`models/*.model.ts`)
TypeScript interfaces for type safety:

```typescript
// user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

#### Validators (`validators/response.validator.ts`)
Validate API responses:

```typescript
export class ResponseValidator {
  static validateUserResponse(response: any): User {
    if (!response.id || !response.email) {
      throw new Error('Invalid user response structure');
    }
    return response as User;
  }

  static validateStatusCode(status: number, expectedStatus: number) {
    if (status !== expectedStatus) {
      throw new Error(`Expected ${expectedStatus}, got ${status}`);
    }
  }
}
```

### 2. Pages Module (`/src/pages`)

#### Base Page (`pages/base/base.page.ts`)
Foundation class with common methods:

```typescript
export class BasePage {
  constructor(protected page: Page) {}

  // Navigation
  async navigate(path: string) {
    await this.page.goto(path);
  }

  // Element interactions
  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  // Waits
  async waitForElement(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  // Visibility checks
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }
}
```

#### Page Modules (`pages/modules/*.page.ts`)
Feature-specific pages extending BasePage:

```typescript
export class LandingPage extends BasePage {
  private selectors = {
    title: 'h1',
    searchBox: 'input.search',
    searchButton: 'button.search-btn',
    movieList: '.movie-list',
    movieCards: '.movie-card'
  };

  async navigateToHome() {
    await this.navigate('/');
  }

  async searchMovie(query: string) {
    await this.fill(this.selectors.searchBox, query);
    await this.click(this.selectors.searchButton);
    await this.waitForElement(this.selectors.movieList);
  }

  async getMovieCount(): Promise<number> {
    return await this.page.locator(this.selectors.movieCards).count();
  }

  async clickFirstMovie() {
    await this.page.locator(this.selectors.movieCards).first().click();
  }
}
```

#### Components (`pages/components/*.component.ts`)
Reusable UI components:

```typescript
export class HeaderComponent extends BasePage {
  private selectors = {
    logo: '.header-logo',
    searchBox: '.header-search',
    userMenu: '.user-menu',
    logout: '.logout-btn'
  };

  async clickLogo() {
    await this.click(this.selectors.logo);
  }

  async logout() {
    await this.click(this.selectors.userMenu);
    await this.click(this.selectors.logout);
  }
}
```

### 3. Fixtures Module (`/src/fixtures`)

#### CustomWorld
Shared context across BDD steps:

```typescript
export class CustomWorld {
  page: Page;
  apiClient: ApiClient;
  
  private testData: Map<string, any> = new Map();
  private pages: Map<string, BasePage> = new Map();

  // Data management
  setTestData(key: string, value: any) {
    this.testData.set(key, value);
  }

  getTestData<T>(key: string): T {
    return this.testData.get(key) as T;
  }

  // Page management
  getPage<T extends BasePage>(PageClass: new (page: Page) => T): T {
    const key = PageClass.name;
    if (!this.pages.has(key)) {
      this.pages.set(key, new PageClass(this.page));
    }
    return this.pages.get(key) as T;
  }

  // Cleanup
  async cleanup() {
    this.testData.clear();
    this.pages.clear();
  }
}
```

### 4. Hooks Module (`/src/hooks`)

#### Global Hooks (`hooks/global.hooks.ts`)
```typescript
Before(async function (this: CustomWorld) {
  logger.info(`Starting scenario: ${this.pickle.name}`);
});

After(async function (this: CustomWorld) {
  if (this.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ path: `failures/${Date.now()}.png` });
    logger.error(`Scenario failed. Screenshot saved.`);
  }
  await this.cleanup();
});
```

#### UI Hooks (`hooks/ui.hooks.ts`)
```typescript
Before('@ui', async function (this: CustomWorld) {
  this.page = await browser.newPage();
  logger.info('Browser page created');
});

After('@ui', async function (this: CustomWorld) {
  await this.page.close();
  logger.info('Browser page closed');
});
```

#### API Hooks (`hooks/api.hooks.ts`)
```typescript
Before('@api', async function (this: CustomWorld) {
  this.apiClient = new ApiClient(config.apiBaseUrl);
  this.apiClient.setAuthToken(config.authToken);
  logger.info('API client initialized');
});
```

### 5. Utils Module (`/src/utils`)

#### Logger (`utils/logger/logger.ts`)
```typescript
// Usage
logger.info('User logged in');
logger.warn('Slow response detected');
logger.error('API request failed', error);
logger.debug('Variable value:', variableValue);

// Output goes to:
// - Console (colored)
// - logs/app-{date}.log (file)
```

#### Data Factory (`utils/data/data-factory.ts`)
```typescript
// Generate fake data
const user = DataFactory.createUser();
const movie = DataFactory.createMovie();
const order = DataFactory.createOrder();

// Consistent, randomized test data
```

#### Retry Handler (`utils/retry/retry-handler.ts`)
```typescript
// Retry flaky operations
await retryHandler.retry(async () => {
  return await page.click('button');
}, { attempts: 3, delay: 1000 });
```

#### Smart Wait (`utils/wait/smart-wait.ts`)
```typescript
// Intelligent waiting
await smartWait.waitForElement(page, selector, 5000);
await smartWait.waitForNavigation(page);
await smartWait.waitForText(page, selector, 'Expected Text');
```

#### Config Manager (`utils/config/config-manager.ts`)
```typescript
// Load environment-specific config
const config = ConfigManager.getConfig();
// Returns: dev, qa, or prod config based on ENVIRONMENT env var
```

---

## Configuration & Setup

### Environment Configuration
```
config/
├── index.ts                    # Main export
├── cucumber.config.ts          # Cucumber settings
└── env/
    ├── dev.env.ts             # Development config
    ├── qa.env.ts              # QA config
    └── prod.env.ts            # Production config
```

### Setting Environment
```bash
# Windows PowerShell
$env:ENVIRONMENT = "dev"
npm run test:ui

# Windows CMD
set ENVIRONMENT=qa
npm run test:ui

# Linux/Mac
export ENVIRONMENT=prod
npm run test:ui
```

### Config Structure
```typescript
// config/env/dev.env.ts
export const devEnv = {
  baseUrl: 'http://localhost:3000',
  apiBaseUrl: 'http://localhost:3000/api',
  browser: 'chromium',
  headless: true,
  timeout: 30000,
  credentials: {
    email: 'test@dev.com',
    password: 'dev_password'
  }
};
```

---

## Test Development Workflow

### Creating a UI Test

**Step 1: Write Feature File**
```gherkin
# src/tests/ui/features/search.feature
@ui @smoke
Feature: Movie Search
  
  Scenario: User searches for a movie
    Given user navigates to home page
    When user searches for "Inception"
    Then search results should display movies
```

**Step 2: Create Page Object**
```typescript
// src/pages/modules/search.page.ts
export class SearchPage extends BasePage {
  private selectors = {
    searchInput: 'input[placeholder="Search movies"]',
    searchButton: 'button[type="submit"]',
    results: '.search-results',
    resultItems: '.result-item'
  };

  async searchMovie(query: string) {
    await this.fill(this.selectors.searchInput, query);
    await this.click(this.selectors.searchButton);
    await this.waitForElement(this.selectors.results);
  }

  async getResultCount(): Promise<number> {
    return await this.page.locator(this.selectors.resultItems).count();
  }
}
```

**Step 3: Write Step Definitions**
```typescript
// src/tests/step-definitions/ui/search.steps.ts
import { When, Then } from '@cucumber/cucumber';
import { SearchPage } from '@pages/modules/search.page';

When('user searches for {string}', async function(this: CustomWorld, query: string) {
  const searchPage = new SearchPage(this.page);
  await searchPage.searchMovie(query);
  this.setTestData('searchQuery', query);
  logger.info(`Searched for: ${query}`);
});

Then('search results should display movies', async function(this: CustomWorld) {
  const searchPage = new SearchPage(this.page);
  const count = await searchPage.getResultCount();
  expect(count).toBeGreaterThan(0);
  logger.info(`Found ${count} movies`);
});
```

**Step 4: Run Test**
```bash
npm run test:ui -- src/tests/ui/features/search.feature
```

### Creating an API Test

**Step 1: Create Model**
```typescript
// src/api/models/movie.model.ts
export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  director: string;
}
```

**Step 2: Create Service**
```typescript
// src/api/services/movie.service.ts
export class MovieService {
  constructor(private client: ApiClient) {}

  async getMovies(): Promise<Movie[]> {
    return await this.client.get('/movies');
  }

  async getMovie(id: number): Promise<Movie> {
    return await this.client.get(`/movies/${id}`);
  }

  async createMovie(movie: Movie): Promise<Movie> {
    return await this.client.post('/movies', movie);
  }
}
```

**Step 3: Write Feature File**
```gherkin
# src/tests/api/features/movies.feature
@api @smoke
Feature: Movie API
  
  Scenario: Fetch all movies
    When user fetches all movies
    Then response should have status 200
    And response should contain movie list
```

**Step 4: Write Step Definitions**
```typescript
// src/tests/step-definitions/api/movies.steps.ts
import { When, Then } from '@cucumber/cucumber';

When('user fetches all movies', async function(this: CustomWorld) {
  const movieService = new MovieService(this.apiClient);
  const movies = await movieService.getMovies();
  this.setTestData('movies', movies);
  logger.info(`Fetched ${movies.length} movies`);
});

Then('response should contain movie list', async function(this: CustomWorld) {
  const movies = this.getTestData<Movie[]>('movies');
  expect(Array.isArray(movies)).toBe(true);
  expect(movies.length).toBeGreaterThan(0);
});
```

**Step 5: Run Test**
```bash
npm run test:api -- src/tests/api/features/movies.feature
```

---

## Best Practices & Patterns

### Do's ✅
- **Clear Steps**: Write business-readable BDD steps
- **Reuse Steps**: Share common step implementations
- **Use Page Objects**: Never hardcode selectors in steps
- **Type Safety**: Always use TypeScript types/interfaces
- **Log Actions**: Document important operations
- **Handle Errors**: Catch and log exceptions
- **Clean Data**: Remove test data after tests
- **Waits Intelligently**: Use SmartWait, not hardcoded sleeps

### Don'ts ❌
- **Raw Selectors**: Hardcoding selectors in step definitions
- **Multiple Actions**: Don't combine unrelated actions in one step
- **Technical Language**: Avoid implementation details in feature files
- **Hardcoded Data**: Use DataFactory instead
- **Console.log**: Use logger instead
- **Ignored Errors**: Always handle errors gracefully
- **Indefinite Waits**: Always set reasonable timeouts
- **Brittle Waits**: Avoid `page.waitForTimeout(5000)`

---

## Debugging & Troubleshooting

### Common Issues & Solutions

**Problem**: Element not found
```
✅ Solution:
1. Verify selector is correct: page.locator(selector).isVisible()
2. Check if element is within viewport
3. Use SmartWait for dynamic elements
4. Take screenshot to see current state
```

**Problem**: Test timeout
```
✅ Solution:
1. Increase timeout in playwright.config.js
2. Check if element is actually loading
3. Verify network conditions
4. Review logs for slow operations
```

**Problem**: API request fails
```
✅ Solution:
1. Verify endpoint URL
2. Check authentication headers
3. Validate request body
4. Review response in logs/reports
```

### Debug Commands
```bash
# Run with Playwright Inspector
npm run test:debug

# Run in headed mode (see browser)
npm run test:headed

# Run with verbose logging
LOGLEVEL=debug npm run test:ui

# Run single scenario
npm run test:ui -- --name "Scenario name"

# Run with specific tag
npm run test:ui -- --tags "@smoke"
```

---

## Resources & References

### Official Documentation
- [Playwright Docs](https://playwright.dev/) - Browser automation
- [Cucumber.js Docs](https://cucumber.io/docs/cucumber/) - BDD framework
- [Gherkin Guide](https://cucumber.io/docs/gherkin/) - Feature syntax
- [TypeScript Handbook](https://www.typescriptlang.org/) - Language features

### Libraries Used
- [Faker.js](https://fakerjs.dev/) - Test data generation
- [Axios](https://axios-http.com/) - HTTP client
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Allure](https://docs.qameta.io/allure/) - Reporting

### Commands Reference
```bash
# Testing
npm test                        # Run all tests
npm run test:ui                # UI tests
npm run test:api               # API tests
npm run test:smoke             # Smoke tests (@smoke tag)

# Development
npm run lint                    # Check code quality
npm run lint:fix               # Auto-fix issues
npm run format                 # Format code

# Reporting
npm run reports:allure         # View Allure report
npm run reports:clean          # Clean reports
npm run clean                  # Clean logs + reports
```

---

## Framework Info
- **Version**: 1.0.0
- **Created**: April 27, 2026
- **Last Updated**: April 27, 2026
- **Status**: Production Ready
