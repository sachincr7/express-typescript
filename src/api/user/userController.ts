import type { Request, RequestHandler, Response } from 'express';

import { userService } from '@/api/user/userService';

class UserController {
  /**
   * Get user by ID
   * @param req - Request object
   * @param res - Response object
   */
  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Get all users with optional pagination
   * @param req - Request object
   * @param res - Response object
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
   * @param req - Request object
   * @param res - Response object
   */
  public getUserById: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
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
    const { organization } = req.params;
    const serviceResponse = await userService.findByOrganization(organization);
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
    const { email } = req.params;
    const serviceResponse = await userService.findByEmail(email);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Update a user
   * @param req - Request object
   * @param res - Response object
   */
  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.updateUser(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  /**
   * Delete a user
   * @param req - Request object
   * @param res - Response object
   */
  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.deleteUser(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const userController = new UserController();
