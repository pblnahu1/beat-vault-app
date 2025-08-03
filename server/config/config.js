
import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

export const PORT = process.env.PORT ?? 3000;

export const JWT_SECRET = process.env.JWT_SECRET;
if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET no está definido');

export const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// variables para local usando pgadmin con docker sin servicios de server y client (npm run dev)
export const LOCAL_DB_USER = process.env.LOCAL_DB_USER;
export const LOCAL_DB_HOST = process.env.LOCAL_DB_HOST;
export const LOCAL_DB_NAME = process.env.LOCAL_DB_NAME;
export const LOCAL_DB_PASSWORD = process.env.LOCAL_DB_PASSWORD;
export const LOCAL_DB_PORT = process.env.LOCAL_DB_PORT ?? 5444;
if(!LOCAL_DB_USER || !LOCAL_DB_HOST || !LOCAL_DB_NAME || !LOCAL_DB_PASSWORD || !LOCAL_DB_PORT) throw new Error("Falta información importante de algunas variables de entorno necesarias para la conexión a la base de datos de manera LOCAL");

// variables para servicios docker
export const DOCKER_DATABASE_URL = process.env.DOCKER_DATABASE_URL;
if(!DOCKER_DATABASE_URL) throw new Error("No existe o hubo un error de tipeo");
export const DOCKER_DB_USER = process.env.DOCKER_DB_USER;
export const DOCKER_DB_HOST = process.env.DOCKER_DB_HOST;
export const DOCKER_DB_NAME = process.env.DOCKER_DB_NAME;
export const DOCKER_DB_PASSWORD = process.env.DOCKER_DB_PASSWORD;
export const DOCKER_DB_PORT = process.env.DOCKER_DB_PORT ?? 5432;
if(!DOCKER_DB_USER || !DOCKER_DB_HOST || !DOCKER_DB_NAME || !DOCKER_DB_PASSWORD || !DOCKER_DB_PORT) throw new Error("Falta información importante de algunas variables de entorno necesarias para la conexión a la base de datos mediante servicios DOCKER");

// supabase
export const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
if(!SUPABASE_DATABASE_URL) throw new Error("No existe o hubo un errro de tipeo.");