import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()], // enable React Optimization
    server: {
        port: 3006,
    },
});