// Edge Function: enviar-resena
// ---------------------------------------------------------------------------
// Portero anti-spam para las reseñas. Verifica el token de Turnstile y solo
// entonces inserta en 'mudafletesrivera' con la service_role key. El navegador
// pierde el permiso de INSERT directo (ver docs/seguridad-antispam.sql), así
// que esta es la ÚNICA puerta para crear una reseña.
//
// Desplegar:  supabase functions deploy enviar-resena

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { verificarTurnstile, cors, json } from '../_shared/turnstile.ts';

const rec = (v: unknown, max: number): string =>
    (typeof v === 'string' ? v : '').trim().slice(0, max);

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

    let payload: Record<string, unknown>;
    try {
        payload = await req.json();
    } catch {
        return json({ error: 'Solicitud malformada' }, 400);
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const ok = await verificarTurnstile(payload.token, ip);
    if (!ok) return json({ error: 'Verificación anti-spam fallida' }, 403);

    const r = (payload.resena ?? {}) as Record<string, unknown>;

    // Saneamiento del lado del servidor: nunca confiamos en lo que llega.
    const nombre = rec(r.nombre, 80);
    const comentario = rec(r.comentario, 150);
    const calificacion = Number(r.calificacion);

    if (nombre.length < 2 || comentario.length < 20) {
        return json({ error: 'Datos inválidos' }, 422);
    }
    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 6) {
        return json({ error: 'Calificación inválida' }, 422);
    }

    const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await admin.from('mudafletesrivera').insert({
        nombre,
        fecha_mudanza: rec(r.fecha_mudanza, 20) || null,
        calificacion,
        aspectos: rec(r.aspectos, 200) || null,
        comentario,
    });

    if (error) {
        console.error('Error insertando reseña:', error);
        return json({ error: 'No se pudo guardar la reseña' }, 500);
    }
    return json({ ok: true });
});
