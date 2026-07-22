// Límite de envíos por IP, para frenar a alguien que insiste manualmente
// (con un navegador real, pasando Turnstile cada vez) en vez de un bot.
// Guarda un registro por envío aceptado en 'rate_limits' y cuenta cuántos
// hubo en la ventana de tiempo antes de dejar pasar uno nuevo.

import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const LIMITE = 3;
const VENTANA_MIN = 10;

export async function dentroDelLimite(
    admin: SupabaseClient,
    ip: string | null | undefined,
    ruta: string,
): Promise<boolean> {
    if (!ip) return true; // sin IP no hay forma de limitar; no bloqueamos por eso

    const desde = new Date(Date.now() - VENTANA_MIN * 60_000).toISOString();
    const { count, error } = await admin
        .from('rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .eq('ruta', ruta)
        .gte('created_at', desde);

    if (error) {
        console.error('Error chequeando límite de envíos:', error);
        return true; // ante un fallo de infraestructura, no bloqueamos al usuario legítimo
    }
    return (count ?? 0) < LIMITE;
}

export async function registrarEnvio(
    admin: SupabaseClient,
    ip: string | null | undefined,
    ruta: string,
): Promise<void> {
    if (!ip) return;
    const { error } = await admin.from('rate_limits').insert({ ip, ruta });
    if (error) console.error('Error registrando envío para el límite:', error);
}
