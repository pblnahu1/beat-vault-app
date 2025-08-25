/** TODO: Code */
// Este script, será una automatización para interactuar con la Base de Datos en Supabase y eliminarlos según un intervalo de tiempo. Servirá para mantener el free trial que nos brinda supabase. 

import {createClient} from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_KEY);

async function insertAndDelete() {
    // inserción
    const {
        data: inserted,
        error: insertedError
    } = await supabase.from('users').insert([{
       email: `temp_${Date.now()}@test.com`,
       hashed_password: 'hashed_placeholder',
       username: `tempuser_${Date.now()}`,
       is_active: true,
       role_id: null,
       refresh_token: null
    }])
    .select();

    if(insertedError) {
        console.log('Error al insertar: ', insertedError);
        process.exit(1);
    }

    console.log('Usuario insertado: ', inserted);

    await new Promise(res=>setTimeout(() => {
        res
    }, 15000))

    const {
        error: deleteError
    } = await supabase.from('users').delete().eq('id_u', inserted[0].id_u);

    if(deleteError) {
        console.log('Error al borrar: ', deleteError);
        process.exit(1);
    }

    console.log('Usuario borrado exitosamente');
}

insertAndDelete();