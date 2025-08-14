import type { Request, RequestHandler, Response } from 'express';

import { shopifySessionService } from '../shopifySessionService';

class ShopifySessionController {
  /**
   * Get session by ID
   */
  public getSession: RequestHandler = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const serviceResponse = await shopifySessionService.loadSession(sessionId);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };

  /**
   * Get sessions by shop
   */
  public getSessionsByShop: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { shop } = req.params;
    const serviceResponse = await shopifySessionService.loadSessionsByShop(
      shop
    );
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };

  /**
   * Create a new session
   */
  public createSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const serviceResponse = await shopifySessionService.storeSession(req.body);
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };

  /**
   * Update session
   */
  public updateSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { sessionId } = req.params;
    const serviceResponse = await shopifySessionService.updateSession(
      sessionId,
      req.body
    );
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };

  /**
   * Delete session
   */
  public deleteSession: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { sessionId } = req.params;
    const serviceResponse = await shopifySessionService.deleteSession(
      sessionId
    );
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };

  /**
   * Delete all sessions for a shop
   */
  public deleteSessionsByShop: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    const { shop } = req.params;
    const serviceResponse = await shopifySessionService.deleteSessionsByShop(
      shop
    );
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };

  /**
   * Check if session exists
   */
  public checkSession: RequestHandler = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const serviceResponse = await shopifySessionService.sessionExists(
      sessionId
    );
    res.status(serviceResponse.statusCode).json(serviceResponse);
  };
}

export const shopifySessionController = new ShopifySessionController();
