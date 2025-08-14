import type { Request, RequestHandler, Response } from 'express';
import { authService } from './authService';
import { User } from '@/drizzle/schema';

class AuthController {
  /**
   * Create a new user
   */
  public registerUser: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.registerUser(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Login a user
   * @param req - Request object
   * @param res - Response object
   */
  public loginUser: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.loginUser(req.user as User);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Verify a token
   * @param req - Request object
   * @param res - Response object
   */
  public verifyToken: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.loginUser(req.user as User);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const authController = new AuthController();
