import tsconfig from './tsconfig.json';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

const paths = tsconfig.compilerOptions.paths;
const baseUrl = tsconfig.compilerOptions.baseUrl;

// Register ts-node with tsconfig paths
register('ts-node/esm', pathToFileURL('./'));
