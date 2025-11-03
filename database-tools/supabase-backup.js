import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Configuración de rutas ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

if (!process.env.SUPABASE_DATABASE_URL) {
  console.error('❌ Error: No se ha configurado SUPABASE_DATABASE_URL');
  process.exit(1);
}

// Parsear la URL de conexión
let dbConfig;
try {
  const url = new URL(process.env.SUPABASE_DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname ? url.pathname.replace(/^\//, '') || 'postgres' : 'postgres',
    user: url.username || 'postgres',
    password: url.password || '',
    ssl: {
      rejectUnauthorized: false // Necesario para Supabase
    }
  };
  
  console.log('🔍 Configuración de conexión:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Puerto: ${dbConfig.port}`);
  console.log(`   Base de datos: ${dbConfig.database}`);
  console.log(`   Usuario: ${dbConfig.user}`);
} catch (error) {
  console.error('❌ Error al parsear la URL de conexión:', error.message);
  process.exit(1);
}

// Configuración de directorios
const backupDir = path.resolve(__dirname, './backups/supabase');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupFilename = `supabase_backup_${timestamp}.sql`;
const backupPath = path.join(backupDir, backupFilename);

// Función para obtener la estructura de una tabla
async function getTableDefinition(client, tableName) {
  try {
    console.log(`   Obteniendo columnas para ${tableName}...`);
    // Obtener columnas
    const columnsQuery = `
      SELECT 
        column_name, 
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const columnsResult = await client.query(columnsQuery, [tableName]);
    
    // Obtener restricciones de clave primaria
    console.log(`   Obteniendo claves primarias para ${tableName}...`);
    const pkQuery = `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE 
        tc.constraint_type = 'PRIMARY KEY' 
        AND tc.table_name = $1;
    `;
    
    const pkResult = await client.query(pkQuery, [tableName]);
    const primaryKeys = pkResult.rows.map(row => row.column_name);
    
    // Construir la definición de la tabla
    let createTable = `CREATE TABLE "${tableName}" (\n`;
    
    const columnDefs = [];
    
    for (const col of columnsResult.rows) {
      try {
        let colDef = `  "${col.column_name}" ${col.data_type.toUpperCase()}`;
        
        // Añadir longitud para tipos de caracteres
        if (col.character_maximum_length) {
          colDef += `(${col.character_maximum_length})`;
        }
        
        // Añadir valor por defecto
        if (col.column_default) {
          // Limpiar el valor por defecto (eliminar ::text, etc.)
          let defaultValue = col.column_default;
          if (defaultValue.includes('::')) {
            defaultValue = defaultValue.split('::')[0];
          }
          // Verificar si el valor por defecto es una función o un valor literal
          if (!/^nextval\(/i.test(defaultValue)) { // Ignorar secuencias
            colDef += ` DEFAULT ${defaultValue}`;
          }
        }
        
        // Añadir NOT NULL
        if (col.is_nullable === 'NO') {
          colDef += ' NOT NULL';
        }
        
        columnDefs.push(colDef);
      } catch (colError) {
        console.warn(`   ⚠️ Error al procesar columna ${col.column_name}:`, colError.message);
        continue;
      }
    }
    
    // Añadir claves primarias
    if (primaryKeys.length > 0) {
      columnDefs.push(`  PRIMARY KEY ("${primaryKeys.join('", "')}")`);
    }
    
    createTable += columnDefs.join(',\n') + '\n);';
    
    // Obtener índices
    console.log(`   Obteniendo índices para ${tableName}...`);
    const indexesQuery = `
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = $1
      AND schemaname = 'public';
    `;
    
    const indexesResult = await client.query(indexesQuery, [tableName]);
    let indexesSQL = '';
    
    for (const idx of indexesResult.rows) {
      // Excluir índices de claves primarias (ya están incluidos en la definición de la tabla)
      if (!idx.indexname.startsWith(`${tableName}_pkey`)) {
        indexesSQL += `${idx.indexdef};\n`;
      }
    }
    
    if (indexesSQL) {
      createTable += '\n' + indexesSQL;
    }
    
    return createTable;
    
  } catch (error) {
    console.error(`❌ Error al obtener definición de la tabla ${tableName}:`, error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

// Función para obtener el esquema de la base de datos
async function getDatabaseSchema(client) {
  try {
    console.log('Obteniendo lista de tablas...');
    // Obtener todas las tablas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('Ejecutando consulta de tablas...');
    const tablesResult = await client.query(tablesQuery);
    console.log(`Se encontraron ${tablesResult.rows.length} tablas`);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    
    let schemaDump = '';
    
    // Obtener la estructura de cada tabla
    for (const table of tables) {
      try {
        console.log(`\n📋 Procesando tabla: ${table}`);
        
        // Obtener la definición de la tabla
        console.log(`   Obteniendo definición de la tabla...`);
        const tableDef = await getTableDefinition(client, table);
        schemaDump += `\n--\n-- Estructura para la tabla ${table}\n--\n\n${tableDef};\n\n`;
        
        // Obtener los datos de la tabla
        console.log(`   Obteniendo datos de la tabla...`);
        const dataResult = await client.query(`SELECT * FROM "${table}"`);
        console.log(`   ${dataResult.rows.length} registros encontrados`);
        
        if (dataResult.rows.length > 0) {
          schemaDump += `--\n-- Datos para la tabla ${table} (${dataResult.rows.length} registros)\n--\n\n`;
          
          // Generar INSERTs para los datos
          for (const row of dataResult.rows) {
            const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
            const values = Object.values(row).map(value => {
              if (value === null) return 'NULL';
              if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
              if (value instanceof Date) return `'${value.toISOString()}'`;
              if (typeof value === 'boolean') return value ? 'true' : 'false';
              return value;
            }).join(', ');
            
            schemaDump += `INSERT INTO "${table}" (${columns}) VALUES (${values});\n`;
          }
          schemaDump += '\n';
        }
      } catch (error) {
        console.warn(`⚠️ Advertencia al procesar la tabla ${table}:`, error.message);
        if (error.stack) {
          console.error('Stack trace:', error.stack);
        }
        // Continuar con la siguiente tabla
        continue;
      }
    }
    
    return schemaDump;
    
  } catch (error) {
    console.error('❌ Error al obtener el esquema de la base de datos:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando respaldo de Supabase...');
  
  // Crear directorio de respaldos si no existe
  await fs.mkdir(backupDir, { recursive: true });
  console.log(`📂 Directorio de respaldos: ${backupDir}`);
  
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    await client.connect();
    
    // Obtener información de la versión de PostgreSQL
    const versionResult = await client.query('SELECT version()');
    console.log('✅ Conectado a:', versionResult.rows[0].version);
    
    // Obtener el esquema y los datos
    console.log('📦 Generando respaldo...');
    const schemaDump = await getDatabaseSchema(client);
    
    // Añadir encabezado al archivo de respaldo
    const timestamp = new Date().toISOString();
    let backupContent = `--
-- Backup de Supabase
-- Generado el: ${timestamp}
-- Base de datos: ${dbConfig.database}@${dbConfig.host}
--

`;
    
    backupContent += schemaDump;
    
    // Escribir el archivo de respaldo
    await fs.writeFile(backupPath, backupContent, 'utf8');
    
    // Verificar que el archivo se creó correctamente
    const stats = await fs.stat(backupPath);
    console.log('\n✅ Respaldo completado exitosamente');
    console.log(`📁 Archivo: ${backupPath}`);
    console.log(`📊 Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error durante el respaldo:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar si es llamado directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { main as backupSupabase };
