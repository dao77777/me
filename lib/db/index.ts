import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                // 最大连接数
  idleTimeoutMillis: 30000,       // 空闲连接超时时间（毫秒）
  connectionTimeoutMillis: 5000,  // 连接超时时间（毫秒）
});

export const db = drizzle({ client: pool, schema });