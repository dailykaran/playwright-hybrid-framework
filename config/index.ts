/// <reference types="node" />
import { devEnv } from './env/dev.env';
import { qaEnv } from './env/qa.env';
import { prodEnv } from './env/prod.env';

export const environments = {
  dev: devEnv,
  qa: qaEnv,
  prod: prodEnv
};
