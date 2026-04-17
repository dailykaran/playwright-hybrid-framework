// Register tsconfig paths before anything else
require('tsconfig-paths').register({
  baseUrl: '.',
  paths: {
    '@pages/*': ['src/pages/*'],
    '@api/*': ['src/api/*'],
    '@fixtures/*': ['src/fixtures/*'],
    '@hooks/*': ['src/hooks/*'],
    '@utils/*': ['src/utils/*'],
    '@constants/*': ['src/constants/*'],
    '@types/*': ['src/types/*'],
    '@test-data/*': ['src/test-data/*']
  }
});

// Load the main cucumber config
module.exports = require('./config/cucumber.config.ts');
