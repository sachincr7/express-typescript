import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import passport from 'passport';
import { env } from '@/common/utils/envConfig';
import { UserService } from '@/api/user/userService';

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

export default passport.use(new JwtStrategy(jwtOptions, jwtVerify));
