import { env } from '@/common/utils/envConfig';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

const isDev = env.isDevelopment;

// Setup Shopify configuration
const shopify = shopifyApi({
  apiKey: env.SHOPIFY_API_KEY,
  apiSecretKey: env.SHOPIFY_API_SECRET,
  scopes: env.SHOPIFY_API_SCOPES.split(','),
  hostName: env.HOST.replace(/https:\/\//, ''),
  hostScheme: 'https',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  logger: { level: isDev ? 3 : 0 }, //Error = 0,Warning = 1,Info = 2,Debug = 3,
});

export default shopify;
