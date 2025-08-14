import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/common/utils/envConfig';

const postgres = neon(env.POSTGRES_URL);
const db = drizzle({ client: postgres });

export default db;
