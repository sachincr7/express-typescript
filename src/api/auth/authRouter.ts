import express, { type Router } from 'express';

import {
  CreateUserSchema,
  GetUserSchema,
  UpdateUserSchema,
} from '@/api/user/userModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { authController } from './authController';
import passport from 'passport';

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
 * GET /auth/users
 * @summary Retrieve all users
 * @description Fetches a list of all users with optional pagination
 * @returns {User[]} Array of user objects
 */
authRouter.get('/users', authController.getUsers);

/**
 * GET /auth/users/:id
 * @summary Retrieve a specific user by ID
 * @description Fetches a single user by their unique identifier
 * @param {number} id - The unique identifier of the user
 * @returns {User} The user object if found
 */
authRouter.get(
  '/users/:id',
  validateRequest(GetUserSchema),
  passport.authenticate('jwt', { session: false }),
  authController.getUserById
);

/**
 * GET /auth/users/email/:email
 * @summary Retrieve a user by email address
 * @description Fetches a single user by their email address
 * @param {string} email - The email address of the user
 * @returns {User} The user object if found
 */
authRouter.get('/users/email/:email', authController.getUserByEmail);

/**
 * PUT /auth/users/:id
 * @summary Update a user
 * @description Updates an existing user's information
 * @param {number} id - The unique identifier of the user
 * @param {object} body - Updated user data
 * @returns {User} The updated user object
 */
authRouter.put(
  '/users/:id',
  validateRequest(UpdateUserSchema),
  authController.updateUser
);

/**
 * DELETE /auth/users/:id
 * @summary Delete a user
 * @description Deletes a user from the system
 * @param {number} id - The unique identifier of the user
 * @returns {boolean} Success status
 */
authRouter.delete(
  '/users/:id',
  validateRequest(GetUserSchema),
  authController.deleteUser
);
