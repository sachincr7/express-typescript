import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import db from '@/drizzle/index';
import {
  shopifySessionsTable,
  type ShopifySession,
  type NewShopifySession,
} from '@/drizzle/schema';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export class ShopifySessionService {
  /**
   * Store a Shopify session
   */
  async storeSession(sessionData: NewShopifySession) {
    try {
      const loadedSession = await db
        .select()
        .from(shopifySessionsTable)
        .where(eq(shopifySessionsTable.id, sessionData.id));

      if (loadedSession.length) {
        const updatedSession = await db
          .update(shopifySessionsTable)
          .set({
            accesstoken: sessionData.accesstoken,
            scope: sessionData.scope,
            shop: sessionData.shop,
            expires: sessionData.expires,
            state: sessionData.state,
          })
          .where(eq(shopifySessionsTable.id, sessionData.id))
          .returning();

        return ServiceResponse.success(
          'Session already exists',
          updatedSession[0],
          StatusCodes.OK
        );
      }

      const result = await db
        .insert(shopifySessionsTable)
        .values(sessionData)
        .returning();
      const session = result[0];

      if (!session) {
        return ServiceResponse.failure(
          'Failed to store session',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      logger.info(`Shopify session stored for shop: ${sessionData.shop}`);
      return ServiceResponse.success(
        'Session stored successfully',
        session,
        StatusCodes.CREATED
      );
    } catch (ex) {
      const errorMessage = `Error storing Shopify session: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while storing session.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Load a Shopify session by ID
   */
  async loadSession(
    sessionId: string
  ): Promise<ServiceResponse<ShopifySession | null>> {
    try {
      const result = await db
        .select()
        .from(shopifySessionsTable)
        .where(eq(shopifySessionsTable.id, sessionId));

      const session = result[0];

      if (!session) {
        return ServiceResponse.failure(
          'Session not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }

      return ServiceResponse.success('Session loaded successfully', session);
    } catch (ex) {
      const errorMessage = `Error loading Shopify session: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while loading session.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Load sessions by shop domain
   */
  async loadSessionsByShop(
    shop: string
  ): Promise<ServiceResponse<ShopifySession[] | null>> {
    try {
      const sessions = await db
        .select()
        .from(shopifySessionsTable)
        .where(eq(shopifySessionsTable.shop, shop));

      if (!sessions || sessions.length === 0) {
        return ServiceResponse.failure(
          'No sessions found for shop',
          null,
          StatusCodes.NOT_FOUND
        );
      }

      return ServiceResponse.success('Sessions loaded successfully', sessions);
    } catch (ex) {
      const errorMessage = `Error loading sessions for shop ${shop}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while loading sessions.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update a Shopify session
   */
  async updateSession(
    sessionId: string,
    updateData: Partial<Omit<NewShopifySession, 'id'>>
  ): Promise<ServiceResponse<ShopifySession | null>> {
    try {
      const result = await db
        .update(shopifySessionsTable)
        .set(updateData)
        .where(eq(shopifySessionsTable.id, sessionId))
        .returning();

      const session = result[0];

      if (!session) {
        return ServiceResponse.failure(
          'Session not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }

      logger.info(`Shopify session updated: ${sessionId}`);
      return ServiceResponse.success('Session updated successfully', session);
    } catch (ex) {
      const errorMessage = `Error updating Shopify session: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while updating session.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete a Shopify session
   */
  async deleteSession(sessionId: string): Promise<ServiceResponse<boolean>> {
    try {
      const result = await db
        .delete(shopifySessionsTable)
        .where(eq(shopifySessionsTable.id, sessionId))
        .returning();

      if (result.length === 0) {
        return ServiceResponse.failure(
          'Session not found',
          false,
          StatusCodes.NOT_FOUND
        );
      }

      logger.info(`Shopify session deleted: ${sessionId}`);
      return ServiceResponse.success('Session deleted successfully', true);
    } catch (ex) {
      const errorMessage = `Error deleting Shopify session: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting session.',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete all sessions for a shop
   */
  async deleteSessionsByShop(shop: string): Promise<ServiceResponse<boolean>> {
    try {
      const result = await db
        .delete(shopifySessionsTable)
        .where(eq(shopifySessionsTable.shop, shop))
        .returning();

      logger.info(`Deleted ${result.length} sessions for shop: ${shop}`);
      return ServiceResponse.success(`Deleted ${result.length} sessions`, true);
    } catch (ex) {
      const errorMessage = `Error deleting sessions for shop ${shop}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while deleting sessions.',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Check if a session exists
   */
  async sessionExists(sessionId: string): Promise<ServiceResponse<boolean>> {
    try {
      const result = await db
        .select({ id: shopifySessionsTable.id })
        .from(shopifySessionsTable)
        .where(eq(shopifySessionsTable.id, sessionId));

      const exists = result.length > 0;
      return ServiceResponse.success('Session check completed', exists);
    } catch (ex) {
      const errorMessage = `Error checking session existence: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'An error occurred while checking session.',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const shopifySessionService = new ShopifySessionService();
