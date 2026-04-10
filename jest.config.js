module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/frontend/src/utils/**/*.test.ts',
    '<rootDir>/frontend/src/**/*.test.tsx',
    '<rootDir>/backend/src/**/*.test.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/frontend/src/test/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: (file) => {
        if (file.includes('/backend/')) {
          return '<rootDir>/backend/tsconfig.json';
        }
        return '<rootDir>/frontend/tsconfig.json';
      }
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
