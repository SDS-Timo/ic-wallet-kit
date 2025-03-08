module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    testPathIgnorePatterns: ["/lib/", "/node_modules/", "/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: ["assetManager-spec"],
    moduleNameMapper: {
        "@common/(.*)": "<rootDir>/src/$1",
      },
    globalSetup: "./__tests_utils/jestGlobalSetup.js",
    collectCoverage: true,
    testTimeout: 10_000
};
 