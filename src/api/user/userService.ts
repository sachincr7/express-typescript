import { StatusCodes } from 'http-status-codes';

import type { User } from '@/api/user/userModel';
import { UserRepository } from '@/api/user/userRepository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { NewUser } from '@/drizzle/schema';

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  /**
   * Create a new user
   * @param userBody - User data
   * @returns Promise<ServiceResponse<User | null>>
   */
  async createUser(
    userBody: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.createAsync(userBody);
      return ServiceResponse.success<User>('User created', user);
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

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure(
          'No Users found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User[]>('Users found', users);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while retrieving users.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User>('User found', user);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${
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
   * Get user by email
   * @param email - User email
   * @returns Promise<ServiceResponse<User | null>>
   */
  async findByEmail(email: string): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User>('User found', user);
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
   * @param id - User id
   * @param updateBody - User data to update
   * @returns Promise<ServiceResponse<User | null>>
   */
  async updateUser(
    id: number,
    updateBody: Partial<Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ServiceResponse<User | null>> {
    try {
      const user = await this.userRepository.updateAsync(id, updateBody);
      if (!user) {
        return ServiceResponse.failure(
          'User not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User>('User updated', user);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${id}: ${
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
   * @param id - User id
   * @returns Promise<ServiceResponse<boolean>>
   */
  async deleteUser(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const result = await this.userRepository.deleteAsync(id);
      if (!result) {
        return ServiceResponse.failure(
          'User not found',
          false,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<boolean>('User deleted', result);
    } catch (ex) {
      const errorMessage = `Error deleting user with id ${id}: ${
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
}

export const userService = new UserService();
