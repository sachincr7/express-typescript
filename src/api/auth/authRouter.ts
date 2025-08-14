import express, { type Router } from 'express';

import {
  CreateUserSchema,
  GetUserSchema,
  UpdateUserSchema,
} from '@/api/user/userModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { authController } from './authController';
import passport from 'passport';
import { authenticateJWT } from '@/middlewares/auth';

export const authRouter: Router = express.Router();
/**
 * POST /auth/users
 * @summary Create a new user
 * @description Creates a new user in the system
 * @param {object} body - User data
 * @returns {User} The created user object
 */
authRouter.post(
  '/register',
  validateRequest(CreateUserSchema),
  authController.registerUser
);

/**
 * POST /auth/login
 * @summary Login a user
 * @description Logs in a user with their email and password
 * @param {object} body - User data
 * @returns {User} The logged in user object
 */
authRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.loginUser
);

/**
 * POST /auth/verify-token
 * @summary Verify a token
 * @description Verifies a token and returns the user
 * @param {object} body - Token data
 * @returns {User} The user object
 */
authRouter.post('/verify-token', authenticateJWT, authController.verifyToken);
