import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/common/utils/envConfig';
import * as schema from './schema';

const postgres = neon(env.POSTGRES_URL);
const db = drizzle({ client: postgres, schema });

export default db;
