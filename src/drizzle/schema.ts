import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  organization: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }),
  email_verified_at: timestamp(),
  role: varchar({ length: 255 }).notNull().default('user'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

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

export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  price: integer().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type ShopifySession = typeof shopifySessionsTable.$inferSelect;
export type NewShopifySession = typeof shopifySessionsTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
