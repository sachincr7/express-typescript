import type { Request, RequestHandler, Response } from 'express';
import { userService } from '@/api/user/userService';
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
   * Get all users with optional pagination
   */
  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const { limit, offset, sortBy, sortOrder } = req.query;

    const options = {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
    };

    const serviceResponse = await userService.queryUsers(options);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Get user by ID
   */
  public getUserById: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Get user by email
   */
  public getUserByEmail: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { email } = req.params;
    const serviceResponse = await userService.findByEmail(email);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Update user by ID
   */
  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.updateUser(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Delete user by ID
   */
  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.deleteUser(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const authController = new AuthController();
