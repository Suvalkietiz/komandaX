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
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: '<rootDir>/frontend/tsconfig.json' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-leaflet|@react-leaflet|leaflet)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

   moduleNameMapper: {
  "\\.(css|less|scss)$": "identity-obj-proxy",
  }
};