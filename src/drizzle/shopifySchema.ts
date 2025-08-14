import { boolean, integer, varchar, pgTable } from 'drizzle-orm/pg-core';

export const shopifySessionsTable = pgTable('shopify_sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  shop: varchar('shop', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  isonline: boolean('isonline').notNull(),
  scope: varchar('scope', { length: 255 }),
  expires: integer('expires'),
  onlineaccessinfo: varchar('onlineaccessinfo', { length: 255 }),
  accesstoken: varchar('accesstoken', { length: 255 }),
});

export type ShopifySession = typeof shopifySessionsTable.$inferSelect;
export type NewShopifySession = typeof shopifySessionsTable.$inferInsert;
