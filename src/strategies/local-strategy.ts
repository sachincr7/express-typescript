import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { userService } from '@/api/user/userService';

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

        if (finduser.data?.password !== password) {
          return done(null, false, {
            message: 'Invalid password',
          });
        }

        done(null, finduser.data);
      } catch (error) {
        done(error);
      }
    }
  )
);
