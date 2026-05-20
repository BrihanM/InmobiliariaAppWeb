import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT || 3000);
export const JWT_SECRET = String(process.env.JWT_SECRET || 'secret');
export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 100);

export const AUTH_TARGETS = (process.env.AUTH_TARGETS || 'http://localhost:4000').split(',');
export const PROPERTY_TARGETS = (process.env.PROPERTY_TARGETS || 'http://localhost:4100').split(',');
export const USER_TARGETS = (process.env.USER_TARGETS || 'http://localhost:4200').split(',');
export const SEARCH_TARGETS = (process.env.SEARCH_TARGETS || 'http://localhost:4300').split(',');
export const PAYMENT_TARGETS = (process.env.PAYMENT_TARGETS || 'http://localhost:4400').split(',');

export default {
  PORT,
  JWT_SECRET,
};
