import { env } from '@/common/utils/envConfig';
import { User } from '@/drizzle/schema';
import moment from 'moment';
import jwt from 'jsonwebtoken';

class TokenService {
  async generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      iat: moment().unix(),
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  async verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}

export const tokenService = new TokenService();
