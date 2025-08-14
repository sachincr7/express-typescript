import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ShopifyInitController {
  /**
   * The shopify will redirect the merchant to '/shopify' route when the Shopify
   * OAuth process is started. This controller handles that request, checks for
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
}

export const shopifyInitController = new ShopifyInitController();
