// https-config.js
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = 'loginform.client';
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

function generateCertificatesIfNeeded() {
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
                '--no-password'
            ], { stdio: 'inherit' });

            if (result.status !== 0) {
                console.warn('⚠️ Failed to generate HTTPS dev certs');
            }
        } catch (err) {
            console.warn('⚠️ Error generating HTTPS certs:', err.message);
        }
    }
}

generateCertificatesIfNeeded();

export const httpsOptions = (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath))
    ? {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath)
    }
    : false;
