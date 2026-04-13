module.exports = {
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }
  },
  testMatch: [
    '<rootDir>/frontend/src/utils/**/*.test.ts',
    '<rootDir>/frontend/src/**/*.test.tsx',
    '<rootDir>/backend/src/**/*.test.ts',
    '<rootDir>/backend/src/**/*.integration.test.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/frontend/src/test/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
