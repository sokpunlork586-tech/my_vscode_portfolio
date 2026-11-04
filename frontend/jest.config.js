const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  cacheDirectory: '<rootDir>/.jest-cache',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-markdown$': '<rootDir>/__mocks__/react-markdown.js',
    '^react-tooltip$': '<rootDir>/__mocks__/react-tooltip.js',
  },
};

module.exports = createJestConfig(customJestConfig);
