module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: __dirname + '/tsconfig.test.json'
    }
  },
  setupFilesAfterEnv: ['jest-extended'],
  maxConcurrency: 1,
  rootDir: 'src/server',
  testRegex: '.spec.ts$',
  transform: {
    '.+\\.(t)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/services/**/*.(t|j)s',
    '**/validators/**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node'
};