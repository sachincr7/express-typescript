import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { shopifySessionService } from './shopifySessionService';
import shopify from '@/config/shopify';
import { NewShopifySession } from '@/drizzle/schema';
import { userService } from '../user/userService';
import { User } from '@/drizzle/schema';
import { tokenService } from '../auth/tokenService';
import { env } from '@/common/utils/envConfig';

interface ShopifyAuthRequest extends Request {
  query: {
    shop?: string;
    code?: string;
    state?: string;
  };
}

class ShopifyController {
  /**
   * The shopify will redirect the merchant to '/shopify' route when the Shopify
   * OAuth process is started. In controller handles that request, checks for
   * the validity of the shop and redirects to the '/api/shopify/auth' route.
   */
  public shopifyInit: RequestHandler = async (req: Request, res: Response) => {
    try {
      if (typeof req.query.shop !== 'string') {
        res.status(500);
        return res.send('No shop provided');
      }

      return res.redirect(
        `/api/shopify/auth?${new URLSearchParams(
          req.query as Record<string, string>
        ).toString()}`
      );
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred during shopify init',
        data: null,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };

  /**
   * Initiate Shopify OAuth authentication
   */
  public authRedirect: RequestHandler = async (
    req: ShopifyAuthRequest,
    res: Response
  ) => {
    try {
      if (!req.query.shop) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Shop parameter is required',
          data: null,
          statusCode: StatusCodes.BAD_REQUEST,
        });
        return;
      }

      return await shopify.auth.begin({
        shop: req.query.shop,
        callbackPath: '/api/shopify/auth/tokens',
        isOnline: false,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred during auth redirect',
        data: null,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };

  public authTokens: RequestHandler = async (req: Request, res: Response) => {
    try {
      const callbackResponse = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      const { session } = callbackResponse;

      const sessionData: NewShopifySession = {
        id: `${session.shop}_${Date.now()}`,
        shop: session.shop,
        state: session.state,
        isonline: true,
        scope: session.scope,
        expires: session.expires
          ? Math.floor(session.expires.getTime() / 1000)
          : null,
      };
      await shopifySessionService.storeSession(sessionData);

      await shopify.webhooks.register({
        session,
      });

      return await shopify.auth.begin({
        shop: session.shop,
        callbackPath: '/api/shopify/auth/callback',
        isOnline: true,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred during auth tokens',
        data: null,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };

  /**
   * Handle Shopify OAuth callback and exchange code for access token
   */
  public handleCallback: RequestHandler = async (
    req: ShopifyAuthRequest,
    res: Response
  ) => {
    try {
      /**
       * Generate shopify store session
       */
      const { session } = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });
      const client = new shopify.clients.Rest({ session });
      const { body } = await client.get({
        path: 'shop',
      });

      let user = await userService.findByOrganization(body.shop.domain);
      if (user?.success) {
        const authToken = await tokenService.generateAccessToken(
          user.data as User
        );

        return res.redirect(
          `${env.FRONTEND_URL}/user/verify-token?token=${authToken}`
        );
      }

      const firstName = body.shop.shop_owner.split(' ')[0];
      const lastName = body.shop.shop_owner.split(' ')[1];

      // Create user if not found
      user = await userService.createUser({
        email: body.shop.email,
        password: 'end&%$Sjnej(*&^%$',
        first_name: firstName,
        last_name: lastName,
        organization: body.shop.domain,
        role: 'user',
        email_verified_at: new Date(),
      });

      if (!user.success) {
        return res.send('User not created');
      }

      const authToken = await tokenService.generateAccessToken(
        user.data as User
      );

      return res.redirect(
        `${env.FRONTEND_URL}/user/verify-token?token=${authToken}`
      );
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred during callback handling',
        data: null,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };

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

export const shopifyController = new ShopifyController();
