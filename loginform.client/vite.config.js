import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target: 'https://localhost:7136',
                secure: false
            }
        },
        port: 64033,
        https: process.env.NODE_ENV === 'development' ? {
            key: './certs/key.pem',
            cert: './certs/cert.pem'
        } : false
    }
});
