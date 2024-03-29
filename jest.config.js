// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: false,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    // collectCoverageFrom: undefined,

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: ["index.ts", "/node_modules/"],

    // An object that configures minimum threshold enforcement for coverage results
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // An array of file extensions your modules use
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

    // The test environment that will be used for testing
    testEnvironment: "node",

    // The glob patterns Jest uses to detect test files
    testMatch: ["**/test/*.[jt]s?(x)"],
    // A map from regular expressions to paths to transformers
    transform: {
        "\\.(ts)$": "ts-jest"
    },
    moduleNameMapper: {
        "@services": "src/services",
        "@configs": "src/configs",
        "@constants": "<rootDir>/src/constants",
        "@dtos/common": "<rootDir>/src/dtos/common.dto.ts",
        "@dtos/in": "<rootDir>/src/dtos/in",
        "@dtos/out": "<rootDir>/src/dtos/out",
        "@utils": "<rootDir>/src/utils.ts"
    },
    roots: ["<rootDir>"],
    modulePaths: ["<rootDir>"],
    moduleDirectories: ["node_modules"]
};
