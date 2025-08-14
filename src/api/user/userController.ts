import type { Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';
import { User } from './userModel';

class UserController {
  /**
   * Get user by ID
   * @param req - Request object
   * @param res - Response object
   */
  public getUserById: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user as User;
    const serviceResponse = await userService.findById(user.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Get user by organization
   * @param req - Request object
   * @param res - Response object
   */
  public getUserByOrganization: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const user = req.user as User;
    const serviceResponse = await userService.findByOrganization(
      user.organization
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Get user by email
   * @param req - Request object
   * @param res - Response object
   */
  public getUserByEmail: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const user = req.user as User;
    const serviceResponse = await userService.findByEmail(user.email);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Update a user
   * @param req - Request object
   * @param res - Response object
   */
  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user as User;
    const serviceResponse = await userService.updateUser(user.id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Delete a user
   * @param req - Request object
   * @param res - Response object
   */
  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user as User;
    const serviceResponse = await userService.deleteUser(user.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const userController = new UserController();
