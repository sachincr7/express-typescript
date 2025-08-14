import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import passport from 'passport';
import { env } from '@/common/utils/envConfig';
import { userService } from '@/api/user/userService';

const jwtOptions: StrategyOptions = {
  secretOrKey: env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

interface JwtPayload {
  sub: number;
  iat: number;
  email: string;
  role: string;
  organization: string;
}

const jwtVerify = async (
  payload: JwtPayload,
  done: VerifiedCallback
): Promise<void> => {
  try {
    if (!payload.organization) {
      return done(null, false);
    }

    done(null, payload);
  } catch (error) {
    done(error, false);
  }
};

export default passport.use(new JwtStrategy(jwtOptions, jwtVerify));
