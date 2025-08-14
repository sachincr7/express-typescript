import { User } from '@/drizzle/schema';
import bcrypt from 'bcryptjs';

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 *
 * @param user
 * @returns
 */
export const filterUserResponse = (user: User): Omit<User, 'password'> => {
  const { password, ...userResponse } = user;
  return userResponse;
};
