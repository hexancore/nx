process.env['TS_NODE_PROJECT'] = 'tsconfig.base.json';

/* eslint-disable */
export default {
  displayName: 'e2e',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/e2e',
  globalSetup: '<rootDir>/src/jest/startLocalRegistry.ts',
  globalTeardown: '<rootDir>/src/jest/stopLocalRegistry.ts',
};
