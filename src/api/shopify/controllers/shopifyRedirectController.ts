import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import shopify from '@/config/shopify';

interface ShopifyAuthRequest extends Request {
  query: {
    shop?: string;
    code?: string;
    state?: string;
  };
}

class ShopifyRedirectController {
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
}

export const shopifyRedirectController = new ShopifyRedirectController();
