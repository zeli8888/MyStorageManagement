import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/storage-management/',
    plugins: [
        react({
            jsxImportSource: '@emotion/react', // replace default 'react' with '@emotion/react'， allowing emotion css props
            babel: {
                plugins: ['@emotion/babel-plugin'] // add emotion babel plugin for Atomic CSS
            }
        })
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            exclude: [
                '**/index.jsx',
                '**/setupTests.js',
                '**/vite.config.js',
                '**/dist/**',
                '**/node_modules/**',
            ]
        },
        setupFiles: './src/__test__/setupTests.js',
        server: {
            deps: {
                inline: ["@mui/x-data-grid"], // treat @mui/x-data-grid as project codes to avoid error
            },
        },
    },
    server: {
        port: 3006,
    }
})