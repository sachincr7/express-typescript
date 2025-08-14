import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
  StrategyOptions,
} from 'passport-jwt';
import { env } from '@/common/utils/envConfig';
import { UserService } from '@/api/user/userService';
import { roleTypes } from './role';

const jwtOptions: StrategyOptions = {
  secretOrKey: env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

interface JwtPayload {
  sub: number;
  iat: number;
  email: string;
  role: string;
}

const jwtVerify = async (
  payload: JwtPayload,
  done: VerifiedCallback
): Promise<void> => {
  try {
    if (payload.role !== roleTypes.ADMIN) {
      throw new Error('Invalid token type');
    }

    const userService = new UserService();
    const userResponse = await userService.findById(Number(payload.sub));

    if (!userResponse.success || !userResponse.responseObject) {
      return done(null, false);
    }

    done(null, userResponse.responseObject);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
