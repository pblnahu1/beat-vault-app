export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // para docker reemplazar por client

export const DB_USER = process.env.DB_USER || "postgres";
export const DB_HOST = process.env.DB_HOST || "db";
export const DB_NAME = process.env.DB_NAME || "db_fluxshop";
export const DB_PASSWORD = process.env.DB_PASSWORD || "pblnahupassword";
export const DB_PORT = process.env.DB_PORT || 5432;