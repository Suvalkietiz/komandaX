module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/frontend/src/utils/**/*.test.ts',
    '<rootDir>/frontend/src/**/*.test.tsx',
  ],
  setupFilesAfterEnv: ['<rootDir>/frontend/src/test/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/frontend/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
