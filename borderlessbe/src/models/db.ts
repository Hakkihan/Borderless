import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
  user: process.env.DB_USER || "default_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "default_database",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  ssl: { rejectUnauthorized: false },
});

export const query = <T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> => {
  return pool.query<T>(text, params);
};





