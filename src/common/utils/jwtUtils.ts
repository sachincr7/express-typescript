import jwt from 'jsonwebtoken';
import { env } from '@/common/utils/envConfig';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (
  userId: number,
  email: string,
  role: string = 'user'
): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: userId.toString(),
    email,
    role,
  };

  console.log('env.JWT_SECRET', env.JWT_SECRET);

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: `${env.JWT_ACCESS_EXPIRATION_MONTHS}M`,
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from Bearer header
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};
