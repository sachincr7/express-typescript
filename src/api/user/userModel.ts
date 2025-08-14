import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';
import type { User as DrizzleUser, NewUser } from '@/drizzle/schema';

extendZodWithOpenApi(z);

// Export the Drizzle types for use in the application
export type User = DrizzleUser;
export type CreateUser = NewUser;

// Zod schemas for API validation and OpenAPI documentation
export const UserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Input validation schema for creating a user
export const CreateUserSchema = z.object({
  body: z.object({
    first_name: z.string().min(1).max(255),
    last_name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    password: z.string().min(8).max(255),
    organization: z.string().min(1).max(255).optional(),
    role: z.string().min(1).max(255).optional(),
    email_verified_at: z.date().optional(),
  }),
});

// Input validation schema for updating a user
export const UpdateUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    first_name: z.string().min(1).max(255).optional(),
    last_name: z.string().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    password: z.string().min(8).max(255).optional(),
  }),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
