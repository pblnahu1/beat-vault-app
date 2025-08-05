import pkg from "pg";
const { Pool } = pkg;
import {
  LOCAL_DB_HOST,
  LOCAL_DB_NAME,
  LOCAL_DB_PASSWORD,
  LOCAL_DB_PORT,
  LOCAL_DB_USER,
  DOCKER_DATABASE_URL,
  SUPABASE_DATABASE_URL,
  NODE_ENV,
} from "./config.js";
import logger from "../utils/loggerConnect.js";

let pool;

if (NODE_ENV === "local") {
  pool = new Pool({
    user: LOCAL_DB_USER,
    host: LOCAL_DB_HOST,
    database: LOCAL_DB_NAME,
    password: LOCAL_DB_PASSWORD,
    port: parseInt(LOCAL_DB_PORT),
    ssl: false, //al estar en desarrollo desactivo
  });
} else if (NODE_ENV === "docker") {
  pool = new Pool({
    connectionString: DOCKER_DATABASE_URL,
  });

  // o usar así si se requiere
  // pool = new Pool({
  //     user: DOCKER_DB_USER,
  //     host: DOCKER_DB_HOST,
  //     database: DOCKER_DB_NAME,
  //     password: DOCKER_DB_PASSWORD,
  //     port: parseInt(DOCKER_DB_PORT),
  //     ssl: false, //al estar en desarrollo desactivo
  // })
} else if (NODE_ENV === "production") {
  pool = new Pool({
    connectionString: SUPABASE_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    host: "db.fiytqkeoolnmspmbjijo.supabase.co"
  });
} else {
  throw new Error(
    `NODE_ENV no válido: '${NODE_ENV}'. Debe ser 'local', 'docker' o 'supabase'.`
  );
}

pool.on("connect", () =>
  logger(
    `Conectado a la Base de Datos (${NODE_ENV}): db_fluxshop`,
    "success",
    NODE_ENV
  )
); // .on es un evento que se ejecuta cuando se conecta a la base de datos
pool.on("error", (err) => logger(`Conexión perida: ${err}`, "error", NODE_ENV)); // .on con 'error' es un evento que se ejecuta cuando se pierde la conexión a la base de datos
pool.on("remove", () =>
  logger("Conexión desde el cliente cerrada", "warning", NODE_ENV)
); // .on con 'remove' es un evento que se ejecuta cuando se elimina la conexión a la base de datos
pool.on("end", () =>
  logger("Conexión finalizada con la Base de Datos", "warning", NODE_ENV)
); // .on con 'end' es un evento que se ejecuta cuando se cierra la conexión a la base de datos

pool
  .connect()
  .then(() =>
    logger(
      "Estás conectado a la Base de Datos 'db_fluxshop'. Podés interactuar desde http://localhost:8080 o mediante comandos de 'psql'. Éxitos en tu desarrollo :D",
      "success",
      NODE_ENV
    )
  )
  .catch((err) =>
    logger(
      `Error al conectar a la Base de Datos 'db_fluxshop': ${err}`,
      "error",
      NODE_ENV
    )
  );

export const query = (text, params) => pool.query(text, params);
