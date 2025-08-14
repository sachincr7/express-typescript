import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import shopify from '@/config/shopify';
import { userService } from '../../user/userService';
import { User } from '@/drizzle/schema';
import { tokenService } from '../../auth/tokenService';
import { env } from '@/common/utils/envConfig';

interface ShopifyAuthRequest extends Request {
  query: {
    shop?: string;
    code?: string;
    state?: string;
  };
}

class ShopifyCallbackController {
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
}

export const shopifyCallbackController = new ShopifyCallbackController();
