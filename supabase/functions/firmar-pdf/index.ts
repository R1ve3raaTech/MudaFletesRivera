// Edge Function: firmar-pdf
// ---------------------------------------------------------------------------
// Genera un enlace TEMPORAL y firmado a un PDF del bucket privado
// 'cotizaciones'. Corre del lado del servidor con la service_role key, que
// NUNCA viaja al navegador. El frontend (anon) solo puede SUBIR archivos;
// no puede leerlos ni listarlos. Para obtener un enlace al PDF tiene que
// pasar por aquí, y aquí decidimos qué firmar y por cuánto tiempo.
//
// Desplegar:  supabase functions deploy firmar-pdf
// (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY se inyectan solas en el entorno
//  de Edge Functions; no hay que configurarlas a mano.)

import { createClient } from 'jsr:@supabase/supabase-js@2';

const BUCKET = 'cotizaciones';
const EXPIRA_SEG = 60 * 60 * 24 * 60; // 60 días: alcanza para el correo y el archivo

const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
            status: 405, headers: { ...cors, 'Content-Type': 'application/json' },
        });
    }

    try {
        const { path } = await req.json();

        // Validación estricta del path: solo un nombre de archivo .pdf, sin
        // subcarpetas ni '..' (evita que pidan firmar rutas ajenas o escapar).
        if (typeof path !== 'string' || !/^[\w.\-]+\.pdf$/.test(path)) {
            return new Response(JSON.stringify({ error: 'Path inválido' }), {
                status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
            });
        }

        const admin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        );

        // Solo firmamos si el archivo existe de verdad en el bucket.
        const { data: url, error } = await admin.storage
            .from(BUCKET)
            .createSignedUrl(path, EXPIRA_SEG);

        if (error || !url?.signedUrl) {
            return new Response(JSON.stringify({ error: 'No se pudo firmar el archivo' }), {
                status: 404, headers: { ...cors, 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ url: url.signedUrl }), {
            headers: { ...cors, 'Content-Type': 'application/json' },
        });
    } catch (_e) {
        return new Response(JSON.stringify({ error: 'Solicitud malformada' }), {
            status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
        });
    }
});
