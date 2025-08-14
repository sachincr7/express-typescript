import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type {
  ShopifySession as DrizzleShopifySession,
  NewShopifySession,
} from '@/drizzle/schema';

extendZodWithOpenApi(z);

// Export the Drizzle types for use in the application
export type ShopifySession = DrizzleShopifySession;
export type CreateShopifySession = NewShopifySession;

// Zod schemas for API validation and OpenAPI documentation
export const ShopifySessionSchema = z.object({
  id: z.string().max(255),
  shop: z.string().max(255),
  state: z.string().max(255),
  isonline: z.boolean(),
  scope: z.string().max(255).optional(),
  expires: z.number().int().optional(),
  onlineaccessinfo: z.string().max(255).optional(),
  accesstoken: z.string().max(255).optional(),
});

// Auth redirect request schema
export const ShopifyAuthRedirectSchema = z.object({
  query: z.object({
    shop: z.string().min(1).describe('Shopify shop domain'),
  }),
});

// Auth callback request schema
export const ShopifyAuthCallbackSchema = z.object({
  query: z.object({
    shop: z.string().min(1),
    code: z.string().min(1),
    state: z.string().optional(),
  }),
});

// Create session schema
export const CreateShopifySessionSchema = z.object({
  body: z.object({
    id: z.string().max(255),
    shop: z.string().max(255),
    state: z.string().max(255),
    isonline: z.boolean(),
    scope: z.string().max(255).optional(),
    expires: z.number().int().optional(),
    onlineaccessinfo: z.string().max(255).optional(),
    accesstoken: z.string().max(255).optional(),
  }),
});

// Update session schema
export const UpdateShopifySessionSchema = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
  body: z.object({
    shop: z.string().max(255).optional(),
    state: z.string().max(255).optional(),
    isonline: z.boolean().optional(),
    scope: z.string().max(255).optional(),
    expires: z.number().int().optional(),
    onlineaccessinfo: z.string().max(255).optional(),
    accesstoken: z.string().max(255).optional(),
  }),
});

// Get session schema
export const GetShopifySessionSchema = z.object({
  params: z.object({ sessionId: z.string().min(1) }),
});

// Get sessions by shop schema
export const GetSessionsByShopSchema = z.object({
  params: z.object({ shop: z.string().min(1) }),
});
