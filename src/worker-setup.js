/* Registers ts-node and tsconfig-paths in every Cucumber worker process (CommonJS) */
// Register ts-node first for TypeScript support
require('ts-node/register');

// Then register tsconfig-paths for path resolution
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
