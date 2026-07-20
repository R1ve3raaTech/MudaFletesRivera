// Edge Function: enviar-cotizacion
// ---------------------------------------------------------------------------
// Portero anti-spam para las cotizaciones. Verifica Turnstile y solo entonces:
//   1) sube el PDF al bucket PRIVADO (service_role),
//   2) genera un enlace firmado y temporal,
//   3) inserta la fila en 'cotizaciones'.
// El navegador pierde el permiso de subir e insertar directo, así que esta es
// la única puerta. Eso frena tanto el relleno de la tabla como el del storage.
//
// Desplegar:  supabase functions deploy enviar-cotizacion

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { verificarTurnstile, cors, json } from '../_shared/turnstile.ts';

const BUCKET = 'cotizaciones';
const EXPIRA_SEG = 60 * 60 * 24 * 60;      // 60 días
const MAX_PDF_BYTES = 5 * 1024 * 1024;     // 5 MB
const MAX_JSON = 8000;                     // tope de tamaño para los bloques anidados

const rec = (v: unknown, max: number): string =>
    (typeof v === 'string' ? v : '').trim().slice(0, max);

// Recorta un objeto anidado a un tamaño serializado máximo (anti-payload gigante)
const objLimitado = (v: unknown): Record<string, unknown> | null => {
    if (!v || typeof v !== 'object') return null;
    try {
        if (JSON.stringify(v).length > MAX_JSON) return null;
        return v as Record<string, unknown>;
    } catch {
        return null;
    }
};

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

    // ── PDF ──
    const filename = rec(payload.filename, 120);
    if (!/^[\w.\-]+\.pdf$/.test(filename)) {
        return json({ error: 'Nombre de archivo inválido' }, 422);
    }
    let bytes: Uint8Array | null = null;
    if (typeof payload.pdfBase64 === 'string' && payload.pdfBase64.length > 0) {
        try {
            const bin = atob(payload.pdfBase64);
            if (bin.length > MAX_PDF_BYTES) return json({ error: 'PDF demasiado grande' }, 413);
            bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
        } catch {
            return json({ error: 'PDF inválido' }, 422);
        }
    }

    const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let pdfPath: string | null = null;
    let signedUrl: string | null = null;
    if (bytes) {
        const up = await admin.storage
            .from(BUCKET)
            .upload(filename, bytes, { contentType: 'application/pdf' });
        if (!up.error) {
            pdfPath = filename;
            const s = await admin.storage.from(BUCKET).createSignedUrl(filename, EXPIRA_SEG);
            signedUrl = s.data?.signedUrl ?? null;
        } else {
            console.error('Error subiendo PDF:', up.error);
        }
    }

    // ── Fila de la cotización (campos saneados / limitados) ──
    const c = (payload.cotizacion ?? {}) as Record<string, unknown>;
    const nombre = rec(c.nombre, 80);
    const origen = rec(c.origen, 200);
    const destino = rec(c.destino, 200);
    if (nombre.length < 2 || !origen || !destino) {
        return json({ error: 'Datos incompletos' }, 422);
    }

    const { error } = await admin.from('cotizaciones').insert({
        nombre,
        origen,
        destino,
        fecha_mudanza: rec(c.fecha_mudanza, 20) || null,
        urgente: c.urgente === true,
        articulos: objLimitado(c.articulos),
        servicios: objLimitado(c.servicios),
        acceso: objLimitado(c.acceso),
        pdf_url: pdfPath,
    });

    if (error) {
        console.error('Error insertando cotización:', error);
        return json({ error: 'No se pudo guardar la cotización' }, 500);
    }
    return json({ ok: true, signedUrl });
});
