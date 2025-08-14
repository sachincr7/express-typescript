import { env } from '@/common/utils/envConfig';
import { User } from '@/drizzle/schema';
import moment from 'moment';
import jwt from 'jsonwebtoken';

class TokenService {
  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      iat: moment().unix(),
      email: user.email,
    };
    return jwt.sign(payload, env.JWT_SECRET);
  }
}

export const tokenService = new TokenService();
