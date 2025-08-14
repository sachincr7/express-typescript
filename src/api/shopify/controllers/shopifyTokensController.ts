import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { shopifySessionService } from '../shopifySessionService';
import shopify from '@/config/shopify';
import { NewShopifySession } from '@/drizzle/schema';

class ShopifyTokensController {
  /**
   * Handle initial auth tokens after offline auth
   */
  public authTokens: RequestHandler = async (req: Request, res: Response) => {
    try {
      const callbackResponse = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      const { session } = callbackResponse;

      const sessionData: NewShopifySession = {
        id: session.id,
        shop: session.shop,
        state: session.state,
        isonline: false,
        scope: session.scope,
        expires: session.expires
          ? Math.floor(session.expires.getTime() / 1000)
          : null,
        accesstoken: session.accessToken,
      };
      await shopifySessionService.storeSession(sessionData);

      await shopify.webhooks.register({
        session,
      });

      return await shopify.auth.begin({
        shop: session.shop,
        callbackPath: '/api/shopify/auth/callback',
        isOnline: false,
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
}

export const shopifyTokensController = new ShopifyTokensController();
