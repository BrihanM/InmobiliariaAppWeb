import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4300;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const STRIPE_SECRET = process.env.STRIPE_SECRET || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
export const CERT_KEY_PATH = process.env.CERT_KEY_PATH || './certs/key.pem';
export const CERT_CRT_PATH = process.env.CERT_CRT_PATH || './certs/cert.pem';
