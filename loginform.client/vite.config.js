import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

const isDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
const httpsOptions = isDev ? (await import('./https-config.js')).httpsOptions : false;

const target = process.env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}`
    : process.env.ASPNETCORE_URLS
        ? process.env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:7136';

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false,
            },
        },
        port: parseInt(process.env.DEV_SERVER_PORT || '64033'),
        https: httpsOptions,
    },
});
