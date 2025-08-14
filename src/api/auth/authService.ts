import { StatusCodes } from 'http-status-codes';

import type { User, NewUser } from '@/drizzle/schema';
import { UserRepository } from '@/api/user/userRepository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { userService } from '@/api/user/userService';

export class AuthService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  /**
   * Register a new user
   * @param userBody - User data to register
   * @returns Promise<ServiceResponse<User | null>>
   */
  async registerUser(
    userBody: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    try {
      const user = await userService.findByEmail(userBody.email);
      if (user.success) {
        return ServiceResponse.failure(
          'User already exists',
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const newUser = await userService.createUser(userBody);
      return ServiceResponse.success('User created successfully', newUser.data);
    } catch (error) {
      const errorMessage = `Error registering user: ${
        (error as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while registering user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Login a user
   * @param userBody - User data to login
   * @returns Promise<ServiceResponse<User | null>>
   */
  async loginUser(userBody: { email: string; password: string }) {
    return ServiceResponse.success('User logged in successfully', userBody);
  }

  /**
   * Create a new user
   * @param userBody - User data to create
   * @returns Promise<ServiceResponse<User | null>>
   */
  async createUser(
    userBody: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ServiceResponse<User | null>> {
    try {
      // Check if email is already taken
      const existingUser = await this.userRepository.findByEmailAsync(
        userBody.email
      );
      if (existingUser) {
        return ServiceResponse.failure(
          'Email already taken',
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await this.userRepository.createAsync(userBody);
      return ServiceResponse.success(
        'User created successfully',
        user,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while creating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Query for users with pagination
   * @param options - Query options
   * @returns Promise<ServiceResponse<User[] | null>>
   */
  async queryUsers(options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ServiceResponse<User[] | null>> {
    try {
      // For now, return all users. In a real app, you'd implement pagination
      const users = await this.userRepository.findAllAsync();

      if (!users || users.length === 0) {
        return ServiceResponse.failure(
          'No users found',
          null,
          StatusCodes.NOT_FOUND
        );
      }

      return ServiceResponse.success('Users retrieved successfully', users);
    } catch (ex) {
      const errorMessage = `Error querying users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving users.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get user by email
   * @param email - User email
   * @returns Promise<ServiceResponse<User | null>>
   */
  async getUserByEmail(email: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success('User found', user);
    } catch (ex) {
      const errorMessage = `Error finding user with email ${email}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while finding user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update user by id
   * @param userId - User ID to update
   * @param updateBody - Data to update
   * @returns Promise<ServiceResponse<User | null>>
   */
  async updateUserById(
    userId: number,
    updateBody: Partial<Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(userId);
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }

      // Check if email is already taken by another user
      if (updateBody.email) {
        const existingUser = await this.userRepository.findByEmailAsync(
          updateBody.email
        );
        if (existingUser && existingUser.id !== userId) {
          return ServiceResponse.failure(
            'Email already taken',
            null,
            StatusCodes.BAD_REQUEST
          );
        }
      }

      const updatedUser = await this.userRepository.updateAsync(
        userId,
        updateBody
      );
      if (!updatedUser) {
        return ServiceResponse.failure(
          'Failed to update user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return ServiceResponse.success('User updated successfully', updatedUser);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${userId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating user.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete user by id
   * @param userId - User ID to delete
   * @returns Promise<ServiceResponse<boolean>>
   */
  async deleteUserById(userId: number): Promise<ServiceResponse<boolean>> {
    try {
      const user = await this.userRepository.findByIdAsync(userId);
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          false,
          StatusCodes.NOT_FOUND
        );
      }

      const deleted = await this.userRepository.deleteAsync(userId);
      if (!deleted) {
        return ServiceResponse.failure(
          'Failed to delete user',
          false,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return ServiceResponse.success('User deleted successfully', true);
    } catch (ex) {
      const errorMessage = `Error deleting user with id ${userId}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting user.',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Check if email is already taken
   * @param email - Email to check
   * @param excludeUserId - User ID to exclude from check (for updates)
   * @returns Promise<boolean>
   */
  async isEmailTaken(email: string, excludeUserId?: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return false;
      }
      return excludeUserId ? user.id !== excludeUserId : true;
    } catch (ex) {
      logger.error(
        `Error checking if email is taken: ${(ex as Error).message}`
      );
      return false;
    }
  }
}

export const authService = new AuthService();
