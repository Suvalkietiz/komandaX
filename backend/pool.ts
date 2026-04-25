/// <reference path="./pg.d.ts" />
import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "study_map",
  password: "TAVO_POSTGRES_PASSWORD",
  port: 5432,
});