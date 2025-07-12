
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ?? 3000;

export const JWT_SECRET = process.env.JWT_SECRET;
if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET no está definido');

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const DB_USER = process.env.DB_USER;
export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = process.env.DB_PORT ?? 5432;

if(!DB_USER || !DB_HOST || !DB_NAME || !DB_PASSWORD || !DB_PORT) throw new Error("Falta información importante de algunas variables de entorno necesarias para la conexión a la base de datos")
