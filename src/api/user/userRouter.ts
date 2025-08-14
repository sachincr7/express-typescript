import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';
import { GetUserSchema, UserSchema } from '@/api/user/userModel';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { validateRequest } from '@/common/utils/httpHandlers';
import { userController } from './userController';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['User'],
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});

userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['User'],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, 'Success'),
});

/**
 * GET /users
 * @summary Retrieve all users
 * @description Fetches a list of all users in the system
 * @returns {User[]} Array of user objects
 */
userRouter.get('/', userController.getUsers);

/**
 * GET /users/:id
 * @summary Retrieve a specific user by ID
 * @description Fetches a single user by their unique identifier
 * @param {number} id - The unique identifier of the user
 * @returns {User} The user object if found
 */
userRouter.get('/:id', validateRequest(GetUserSchema), userController.getUser);
