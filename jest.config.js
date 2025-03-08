module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    testPathIgnorePatterns: ["/lib/", "/node_modules/", "/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: ["assetManager-spec"],
    moduleNameMapper: {
        "@app/(.*)": "<rootDir>/src/$1",
        "@utils/(.*)": "<rootDir>/src/utils/$1"
      },
    globalSetup: "./__tests_utils/jestGlobalSetup.js",
    collectCoverage: true,
    testTimeout: 10_000
};
 