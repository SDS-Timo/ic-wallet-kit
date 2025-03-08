module.exports = {
    //Fixed error
    //Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax,
    //or when Jest is not configured to support such syntax.
    //SyntaxError: Unexpected token 'export'
    //https://stackoverflow.com/questions/66465339/how-to-make-ts-jest-work-with-import-export-syntax-of-the-js-files-that-are-bein
    globals: {
        extensionsToTreatAsEsm: ['.ts', '.js'],
        'ts-jest': {
            useESM: true
        }
    },

    preset: 'ts-jest/presets/js-with-ts-esm',
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    testPathIgnorePatterns: ["/lib/", "/node_modules/", "/dist/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    modulePathIgnorePatterns: ["assetManager-spec"],
    moduleNameMapper: {
        "@icrc/(.*)": "<rootDir>/src/$1",
        "@test/(.*)": "<rootDir>/src/__tests_util/$1",
    },
    globalSetup: "./__tests_utils/jestGlobalSetup.js",
    collectCoverage: false,
    coveragePathIgnorePatterns: [
        "src/__tests_utils",
        "src/candid"
    ],

    testTimeout: 100_000
};