/** TODO: Code */
// Este script, será una automatización para interactuar con la Base de Datos en Supabase y eliminarlos según un intervalo de tiempo. Servirá para mantener el free trial que nos brinda supabase. 
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js'
dotenv.config();

const SUPABASE_URL = "https://fiytqkeoolnmspmbjijo.supabase.co"
const SUPABASE_KEY = process.env.SUPABASE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function keepAlive() {
  try {
    // Inserta un dummy user
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        { email: 'dummy@test.com', hashed_password: '1234', username: 'dummy_user' }
      ])

    if (insertError) throw insertError
    console.log('✅ Insert OK')

    // Esperar 15 segundos
    await new Promise(r => setTimeout(r, 15000))

    // Borrar el dummy
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'dummy@test.com')

    if (deleteError) throw deleteError
    console.log('🗑️ Delete OK')

  } catch (err) {
    console.error('Error en keepAlive:', err)
  }
}

keepAlive()
