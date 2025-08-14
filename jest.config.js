export default {
    testEnvironment: 'jsdom',          // test environment
    roots: ['<rootDir>/src'],          // test root directory
    testMatch: [                       // match test files
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {                       // test transform rules
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        '^.+\\.css$': '<rootDir>/src/__test__/cssTransform.js' // handle css
    },
    moduleNameMapper: {                // module alias
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(jpg|jpeg|png)$': 'identity-obj-proxy' // handle image
    },
    setupFilesAfterEnv: ['<rootDir>/src/__test__/setupTests.js'], // test setup file
    collectCoverage: true,             // test coverage
    collectCoverageFrom: [             // specify coverage range
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',               // exclude d.ts, declaration files
        '!src/main.tsx'                // exclude main.tsx
    ],
    coverageReporters: ['html', 'text-summary'] // coverage report format
};
