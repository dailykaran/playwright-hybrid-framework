import { register } from 'tsconfig-paths';

register({
  baseUrl: '.',
  paths: {
    '@pages/*': ['src/pages/*'],
    '@api/*': ['src/api/*'],
    '@fixtures/*': ['src/fixtures/*'],
    '@hooks/*': ['src/hooks/*'],
    '@utils/*': ['src/utils/*'],
    '@constants/*': ['src/constants/*'],
    '@types/*': ['src/types/*'],
    '@test-data/*': ['src/test-data/*'],
  },
});
