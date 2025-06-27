import pkg from "pg";
const {Pool} = pkg;

// Para local
/*const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_fluxshop',
    password: 'pblnahupassword',
    port: 5444,
    ssl: false, //al estar en desarrollo desactivo
})*/

/// Para Docker
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// pool.on('connect', () => console.log('DB connected')) // .on es un evento que se ejecuta cuando se conecta a la base de datos
// pool.on('error', (err) => console.error('Lost PG connection', err)) // .on con 'error' es un evento que se ejecuta cuando se pierde la conexión a la base de datos
// pool.on('remove', () => console.log('DB disconnected')) // .on con 'remove' es un evento que se ejecuta cuando se elimina la conexión a la base de datos
// pool.on('end', () => console.log('DB connection closed')) // .on con 'end' es un evento que se ejecuta cuando se cierra la conexión a la base de datos

pool.connect()
    .then(() => console.log("conectado a la base de datos db_fluxshop"))
    .catch(err => console.error("error al conectar a la base de datos db_fluxshop", err))

export const query = (text, params) => pool.query(text, params);