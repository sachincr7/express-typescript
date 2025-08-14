import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';

import { userService } from '@/api/user/userService';
import { comparePassword } from '@/common/utils/passwordUtils';
import type { User } from '@/drizzle/schema';
import { logger } from '@/server';

export default passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const finduser = await userService.findByEmail(email);

        if (!finduser.success) {
          return done(null, false, {
            message: 'No user found with this email',
          });
        }

        const isPasswordValid = await comparePassword(
          password,
          finduser.data?.password || ''
        );
        if (!isPasswordValid) {
          done(null, false, {
            message: 'Invalid password',
          });
        }

        done(null, finduser.data as User);
      } catch (error) {
        done(error);
      }
    }
  )
);
