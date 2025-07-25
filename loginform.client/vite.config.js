import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

// Check if running on Vercel
const isVercel = !!process.env.VERCEL;
const isDev = !isVercel && process.env.NODE_ENV !== 'production';

let httpsOptions = false;

if (isDev) {
    const baseFolder =
        env.APPDATA !== undefined && env.APPDATA !== ''
            ? `${env.APPDATA}/ASP.NET/https`
            : `${env.HOME}/.aspnet/https`;

    const certificateName = "loginform.client";
    const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
    const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        try {
            fs.mkdirSync(baseFolder, { recursive: true });

            const result = child_process.spawnSync('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit' });

            if (result.status !== 0) {
                console.warn('⚠️ Failed to generate HTTPS dev certs');
            }
        } catch (err) {
            console.warn('⚠️ Error generating HTTPS certs:', err.message);
        }
    }

    if (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)) {
        httpsOptions = {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        };
    }
}

const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(';')[0]
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
        port: parseInt(env.DEV_SERVER_PORT || '64033'),
        https: httpsOptions,
    },
});
