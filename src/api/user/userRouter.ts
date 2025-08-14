import express, { type Router } from 'express';
import { GetUserSchema, UpdateUserSchema } from '@/api/user/userModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { userController } from './userController';
import { authenticateJWT } from '@/middlewares/auth';

export const userRouter: Router = express.Router();

/**
 * GET /user/:id
 * @summary Retrieve a specific user by ID
 * @description Fetches a single user by their unique identifier
 * @param {number} id - The unique identifier of the user
 * @returns {User} The user object if found
 */
userRouter.get('/details', authenticateJWT, userController.getUserById);

/**
 * PUT /user/users/:id
 * @summary Update a user
 * @description Updates an existing user's information
 * @param {number} id - The unique identifier of the user
 * @param {object} body - Updated user data
 * @returns {User} The updated user object
 */
userRouter.put(
  '/update',
  validateRequest(UpdateUserSchema),
  authenticateJWT,
  userController.updateUser
);

/**
 * GET /auth/users/email/:email
 * @summary Retrieve a user by email address
 * @description Fetches a single user by their email address
 * @param {string} email - The email address of the user
 * @returns {User} The user object if found
 */
userRouter.get('/email/:email', authenticateJWT, userController.getUserByEmail);

/**
 * DELETE /auth/users/:id
 * @summary Delete a user
 * @description Deletes a user from the system
 * @param {number} id - The unique identifier of the user
 * @returns {boolean} Success status
 */
userRouter.delete(
  '/delete',
  validateRequest(GetUserSchema),
  authenticateJWT,
  userController.deleteUser
);
