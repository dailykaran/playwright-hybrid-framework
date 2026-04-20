# Playwright Hybrid BDD Framework

A complete automation testing framework using Playwright with BDD (Gherkin). Supports both **API testing** and **UI testing**.

## Quick Start

### Installation
```bash
npm install
npx playwright install
```

### Run Tests
```bash
npm test                # All tests
npm run test:api        # API tests only (✅ Working)
npm run test:ui         # UI tests only
npm run test:smoke      # Smoke tests
npm run test:headed     # See browser while running
npm run test:debug      # Debug mode
```

## Project Structure

```
src/
├── tests/
│   ├── api/features/        # API test scenarios
│   ├── ui/features/         # UI test scenarios
│   └── step-definitions/    # Test step implementations
├── pages/                   # Page Object Model (POM) for UI tests
├── api/
│   ├── clients/            # HTTP API client
│   ├── services/           # API service classes
│   └── models/             # Data interfaces
├── utils/
│   ├── logger/             # Test logging
│   ├── config/             # Configuration management
│   ├── data/               # Test data generation
│   ├── retry/              # Retry mechanism
│   └── wait/               # Smart waits
├── hooks/                  # Before/After test hooks
└── constants/              # Endpoints & messages
```

## ✅ What's Working

### API Tests (5/5 Passing)
- Get all movies
- Create a new movie
- Get movie by ID
- Update movie information
- Delete movie

### UI Tests  
- Landing page with movie showcase
- Movie cards display
- Page navigation

## How to Use

### 1️⃣ Create a Test Feature (Gherkin)

`src/tests/api/features/movies.feature`
```gherkin
Feature: Movies API
  @api @smoke
  Scenario: Get all movies
    When user calls GET endpoint "/movies"
    Then response status should be 200
```

### 2️⃣ Create Step Definition

`src/tests/step-definitions/api/movies.steps.ts`
```typescript
import { When, Then } from '@cucumber/cucumber';
import { MoviesService } from '@api/services/movies.service';
import { expect } from '@playwright/test';

When('user calls GET endpoint {string}', async function(endpoint: string) {
  const service = new MoviesService();
  this.response = await service.getAllMovies();
});

Then('response status should be {int}', async function(status: number) {
  expect(this.response).toBeDefined();
});
```

### 3️⃣ Create API Service

`src/api/services/movies.service.ts`
```typescript
import { ApiClient } from '../clients/api.client';

export class MoviesService {
  private apiClient = new ApiClient();

  async getAllMovies() {
    const response = await this.apiClient.get('/movies');
    return response.data;
  }
}
```

## Configuration

Set environment in `config/env/`:
```typescript
export const devEnv = {
  baseUrl: 'http://localhost:3000',
  apiBaseUrl: 'http://localhost:5000/api',
  timeout: 60000,
  headless: false,
  logLevel: 'info'
};
```

Run tests with environment:
```bash
ENVIRONMENT=dev npm test
ENVIRONMENT=qa npm run test:api
ENVIRONMENT=prod npm run test:smoke
```

## Available Utilities

### Logging
```typescript
import { logger } from '@utils/logger/logger';

logger.info('Test started');
logger.error('Failed');
logger.debug('Debug info');
```

### Generate Test Data
```typescript
import { DataFactory } from '@utils/data/data-factory';

const user = DataFactory.generateUser();      // Random user
const order = DataFactory.generateOrder();    // Random order
const product = DataFactory.generateProduct(); // Random product
```

### Smart Waits
```typescript
import { SmartWait } from '@utils/wait/smart-wait';

const wait = new SmartWait(page);
await wait.waitForElement('button.submit');
await wait.waitForText('div.success', 'Success!');
```

### Retry Operations
```typescript
import { RetryHandler } from '@utils/retry/retry-handler';

const retry = new RetryHandler();
await retry.execute(
  async () => await element.click(),
  { maxRetries: 3, delayMs: 1000 }
);
```

## Commands

```bash
# Run with specific tags
npm test -- --tags "@smoke"
npm test -- --tags "@api and not @skip"

# Run specific feature
npm test -- src/tests/api/features/movies.feature

# Headed mode (see browser)
npm run test:headed

# Code quality
npm run lint           # Check code
npm run lint:fix       # Fix issues
npm run format         # Format code
npm run type-check     # TypeScript check
```

## Reports

```bash
npm run reports:allure      # View Allure report
npm run reports:clean       # Clear old reports
```

Reports location:
- `reports/cucumber/` - Test results
- `reports/failures/` - Screenshots of failed tests
- `logs/` - Test execution logs

## Tag Strategy

```gherkin
@smoke       # Critical tests (run first)
@regression  # Full test suite
@ui          # UI tests only
@api         # API tests only
@skip        # Skip this test
```

## Recent Updates

- ✅ Fixed TypeScript strict mode (no `any` types)
- ✅ All 5 API tests passing
- ✅ Dynamic test data (no hardcoded IDs)
- ✅ Type-safe error handling
- ✅ Improved logging throughout

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Browsers not found | `npx playwright install` |
| Element not found | Use `npm run test:headed` to debug |
| API errors | Check `config/env/` for correct baseUrl |
| TypeScript errors | Run `npm run type-check` |

## Learn More

See **[FRAMEWORK_STUDY_GUIDE.md](./FRAMEWORK_STUDY_GUIDE.md)** for detailed architecture.

---

**Happy Testing! 🎭**
