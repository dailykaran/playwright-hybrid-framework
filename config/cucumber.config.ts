/// <reference types="node" />
// Configure ts-node to skip type checking for faster execution
if (!process.env.TS_NODE_TRANSPILE_ONLY) {
  process.env.TS_NODE_TRANSPILE_ONLY = 'true';
}

module.exports = {
  default: {
    require: ['src/fixtures/world.ts', 'src/setup.ts', 'src/tests/step-definitions/**/*.steps.ts', 'src/hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber/cucumber-report.json',
      'html:reports/cucumber/cucumber-report.html',
      '@cucumber/pretty-formatter'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      theme: {
        'feature keyword': ['cyan', 'bold'],
        'feature description': ['cyan'],
        'scenario keyword': ['yellow', 'bold'],
        'scenario description': ['yellow'],
        'step keyword': ['magenta', 'bold'],
        'step text': ['magenta'],
        'tag': ['cyan'],
        'failed step': ['red', 'bold']
      }
    },
    parallel: 2,
    strict: true,
    dryRun: false,
    failFast: false,
    order: 'random'
  },
  ui: {
    require: ['src/fixtures/world.ts', 'src/setup.ts', 'src/tests/step-definitions/ui/**/*.steps.ts', 'src/hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    features: ['src/tests/ui/features'],
    format: [
      'progress-bar',
      'json:reports/cucumber/ui-report.json',
      'html:reports/cucumber/ui-report.html'
    ],
    parallel: 2
  },
  api: {
    require: ['src/fixtures/world.ts', 'src/setup.ts', 'src/tests/step-definitions/api/**/*.steps.ts', 'src/hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    features: ['src/tests/api/features'],
    format: [
      'progress-bar',
      'json:reports/cucumber/api-report.json',
      'html:reports/cucumber/api-report.html'
    ],
    parallel: 2
  },
  all: {
    require: ['src/fixtures/world.ts', 'src/setup.ts', 'src/tests/step-definitions/**/*.steps.ts', 'src/hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber/all-report.json',
      'html:reports/cucumber/all-report.html'
    ],
    parallel: 3
  }
};
