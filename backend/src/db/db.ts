import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const hasConnectionString = Boolean(process.env.DATABASE_URL);

const connectionOptions = hasConnectionString
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD ?? "",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    };

export const db = new Pool({
  ...connectionOptions,
});
