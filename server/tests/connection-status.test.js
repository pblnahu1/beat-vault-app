import {test, describe} from 'node:test'
import assert from 'node:assert'
import {query} from '../config/db'

describe('DB', () => {
    // test para verificar que la conexión a la base de datos de postgres dockerizada funcione exitosamente
    test('Base de Datos: conexión exitosa', async () => {
        try {
            // ejecuta una consulta que debería devolver 2 como resultado
            const res = await query("SELECT 1 + 1 AS result")
            // verifica que el resultado sea el esperado
            assert.strictEqual(res.rows[0].result, 2)
            // muestra en la consola también
            console.log("CONEXIÓN A LA DB EXITOSA")
        } catch (error) {
            // si ocurre un error al conectarse o consultar, falla el test explícitamente
            assert.fail(`Falló la conexión a la DB: ${error.message}`)
        }
    })
})
