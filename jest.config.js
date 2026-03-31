const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: ["<rootDir>/src/tests/unit/**/*.test.ts", "<rootDir>/src/tests/unit/**/*.test.tsx"]
};

module.exports = createJestConfig(customJestConfig);
