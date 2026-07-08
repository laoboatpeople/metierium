import { config } from 'dotenv';

config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const env = {
  PORT: optionalEnv('PORT', '4006'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  FRONTEND_URL: optionalEnv('FRONTEND_URL', 'http://localhost:3006'),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  STRIPE_SECRET_KEY: optionalEnv('STRIPE_SECRET_KEY', ''),
  STRIPE_WEBHOOK_SECRET: optionalEnv('STRIPE_WEBHOOK_SECRET', 'whsec_placeholder'),
  STRIPE_ESSENTIAL_PRICE_ID: optionalEnv('STRIPE_ESSENTIAL_PRICE_ID', ''),
  STRIPE_PRO_PRICE_ID: optionalEnv('STRIPE_PRO_PRICE_ID', ''),
  STRIPE_LIFETIME_PRICE_ID: optionalEnv('STRIPE_LIFETIME_PRICE_ID', ''),
  RESEND_API_KEY: optionalEnv('RESEND_API_KEY', 're_placeholder'),
  TURNSTILE_SECRET_KEY: optionalEnv('TURNSTILE_SECRET_KEY', ''),
  DEEPSEEK_API_KEY: optionalEnv('DEEPSEEK_API_KEY', ''),
} as const;

export type Env = typeof env;
