"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
dotenv_1.default.config();
const { Pool } = pg_1.default;
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
exports.db = new Pool({
    ...connectionOptions,
});
