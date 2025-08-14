import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { User } from '@/api/user/userModel';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: User, info: any) => {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .json({ message: info?.message || 'Unauthorized' });
      }

      req.user = user; // Attach user to request
      next();
    }
  )(req, res, next);
};
