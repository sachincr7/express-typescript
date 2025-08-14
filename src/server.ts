import cors from 'cors';
import '@shopify/shopify-api/adapters/node';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { authRouter } from '@/api/auth/authRouter';
import { shopifyRouter } from '@/api/shopify/shopifyRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import passport from 'passport';
import './strategies/local-strategy';
import './strategies/jwt-strategy';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// jwt authentication
app.use(passport.initialize());

// Routes
app.use('/api/health-check', healthCheckRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/shopify', shopifyRouter);

// Swagger UI
// app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
