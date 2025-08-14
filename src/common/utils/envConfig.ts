import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  HOST: z.string().min(1).default('localhost'),

  PORT: z.coerce.number().int().positive().default(8080),

  CORS_ORIGIN: z.string().url().default('http://localhost:8080'),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

  JWT_SECRET: z.string().min(1).default('your-secret-key-change-in-production'),

  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(30)
    .describe('minutes after which access tokens expire'),

  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .describe('minutes after which reset password token expires'),

  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .describe('minutes after which verify email token expires'),

  SMTP_HOST: z.string().optional().describe('server that will send the emails'),
  SMTP_PORT: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('port to connect to the email server'),
  SMTP_USERNAME: z.string().optional().describe('username for email server'),
  SMTP_PASSWORD: z.string().optional().describe('password for email server'),
  EMAIL_FROM: z
    .string()
    .optional()
    .describe('the from field in the emails sent by the app'),

  POSTGRES_URL: z
    .string()
    .url()
    .describe('url to connect to the postgres database'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isTest: parsedEnv.data.NODE_ENV === 'test',
};
