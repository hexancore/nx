/* eslint-disable */

import { readFileSync } from "fs";
import { pathsToModuleNameMapper } from 'ts-jest';

const tsConfig = JSON.parse(readFileSync(__dirname+`/tsconfig.json`, 'utf-8'));
export default {
  displayName: 'Plugin',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  moduleNameMapper: {
    //...pathsToModuleNameMapper(tsConfig.compilerOptions.paths),
    '^(\\.{1,2}/.*)\\.js$': '$1',

  },
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json', useESM: true, }],
  },
  resolver: '<rootDir>/mjs-resolver.ts',

  testMatch: [
    "**/*.+(test).*(m)[jt]s"
  ],
  transformIgnorePatterns: ['node_modules'],
  moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "mts", "cts", "tsx", "json", "node"],
  coverageDirectory: '../../coverage/packages/plugin'
};
