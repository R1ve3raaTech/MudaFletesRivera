// Verificación del token de Cloudflare Turnstile del lado del servidor.
// Se llama desde las Edge Functions ANTES de escribir en la base.
// El secreto vive en la variable de entorno TURNSTILE_SECRET (nunca en el
// navegador). Configurar con:
//   supabase secrets set TURNSTILE_SECRET=tu_secret_key

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verificarTurnstile(token: unknown, ip?: string | null): Promise<boolean> {
    const secret = Deno.env.get('TURNSTILE_SECRET');
    if (!secret) {
        console.error('Falta TURNSTILE_SECRET en el entorno de la función');
        return false;
    }
    if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
        return false;
    }

    const body = new FormData();
    body.append('secret', secret);
    body.append('response', token);
    if (ip) body.append('remoteip', ip);

    try {
        const r = await fetch(SITEVERIFY, { method: 'POST', body });
        const data = await r.json();
        return data?.success === true;
    } catch (e) {
        console.error('Error verificando Turnstile:', e);
        return false;
    }
}

export const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(payload: unknown, status = 200): Response {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json' },
    });
}
