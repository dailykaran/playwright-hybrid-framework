/// <reference types="node" />
import { devEnv } from './env/dev.env';
import { qaEnv } from './env/qa.env';
import { prodEnv } from './env/prod.env';
import { apiMoviesEnv } from './env/api-movies.env';

export const environments = {
  dev: devEnv,
  qa: qaEnv,
  prod: prodEnv,
  'api-movies': apiMoviesEnv
};
