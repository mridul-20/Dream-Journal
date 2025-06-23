module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}; 