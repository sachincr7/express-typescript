import express, { type Router } from 'express';

import {
  ShopifyAuthRedirectSchema,
  ShopifyAuthCallbackSchema,
  CreateShopifySessionSchema,
  UpdateShopifySessionSchema,
  GetShopifySessionSchema,
  GetSessionsByShopSchema,
} from './shopifyModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { shopifyController } from './shopifyController';

export const shopifyRouter: Router = express.Router();

/**
 * GET /shopify
 * @summary Initiate Shopify OAuth process
 * @description Redirects to Shopify OAuth authorization URL
 */
shopifyRouter.get('/', shopifyController.shopifyInit);

/**
 * GET /shopify/auth
 * @summary Initiate Shopify OAuth authentication
 * @description Redirects to Shopify OAuth authorization URL
 */
shopifyRouter.get(
  '/auth',
  validateRequest(ShopifyAuthRedirectSchema),
  shopifyController.authRedirect
);

/**
 * GET /shopify/auth/tokens
 * @summary Handle Shopify OAuth callback
 * @description Exchanges authorization code for access token and stores session
 */
shopifyRouter.get(
  '/auth/tokens',
  validateRequest(ShopifyAuthCallbackSchema),
  shopifyController.authTokens
);

/**
 * GET /shopify/auth/callback
 * @summary Handle Shopify OAuth callback
 * @description Exchanges authorization code for access token and stores session
 */
shopifyRouter.get(
  '/auth/callback',
  validateRequest(ShopifyAuthCallbackSchema),
  shopifyController.handleCallback
);

/**
 * GET /shopify/sessions/:sessionId
 * @summary Get session by ID
 * @description Retrieves a Shopify session by its ID
 */
shopifyRouter.get(
  '/sessions/:sessionId',
  validateRequest(GetShopifySessionSchema),
  shopifyController.getSession
);

/**
 * GET /shopify/sessions/shop/:shop
 * @summary Get sessions by shop domain
 * @description Retrieves all sessions for a specific shop
 */
shopifyRouter.get(
  '/sessions/shop/:shop',
  validateRequest(GetSessionsByShopSchema),
  shopifyController.getSessionsByShop
);

/**
 * POST /shopify/sessions
 * @summary Create a new session
 * @description Creates a new Shopify session
 */
shopifyRouter.post(
  '/sessions',
  validateRequest(CreateShopifySessionSchema),
  shopifyController.updateSession
);

/**
 * PUT /shopify/sessions/:sessionId
 * @summary Update session
 * @description Updates an existing Shopify session
 */
shopifyRouter.put(
  '/sessions/:sessionId',
  validateRequest(UpdateShopifySessionSchema),
  shopifyController.updateSession
);

/**
 * DELETE /shopify/sessions/:sessionId
 * @summary Delete session
 * @description Deletes a Shopify session by ID
 */
shopifyRouter.delete(
  '/sessions/:sessionId',
  validateRequest(GetShopifySessionSchema),
  shopifyController.deleteSession
);

/**
 * DELETE /shopify/sessions/shop/:shop
 * @summary Delete all sessions for a shop
 * @description Deletes all sessions for a specific shop
 */
shopifyRouter.delete(
  '/sessions/shop/:shop',
  validateRequest(GetSessionsByShopSchema),
  shopifyController.deleteSessionsByShop
);

/**
 * GET /shopify/sessions/:sessionId/exists
 * @summary Check if session exists
 * @description Checks if a session exists by ID
 */
shopifyRouter.get(
  '/sessions/:sessionId/exists',
  validateRequest(GetShopifySessionSchema),
  shopifyController.checkSession
);
