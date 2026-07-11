// Cron diario (Vercel): seguimiento de solicitudes del día anterior.
// Lista los clientes que cotizaron ayer con su WhatsApp para poder
// contactarlos si no escribieron. Correo solo a la administradora.
// Requiere las mismas variables de entorno que recordatorios.js.

const EMAIL_PRINCIPAL = 'thecamil999@gmail.com';

export default async function handler(req, res) {
    if (process.env.CRON_SECRET &&
        req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return res.status(500).json({ error: 'Faltan variables de entorno de Supabase' });

    const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const hoy = new Date().toISOString().slice(0, 10);

    const r = await fetch(
        `${url}/rest/v1/cotizaciones?created_at=gte.${ayer}T00:00:00&created_at=lt.${hoy}T00:00:00&order=created_at.asc&select=nombre,origen,destino,fecha_mudanza,urgente,pdf_url,acceso,created_at`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!r.ok) return res.status(502).json({ error: 'Error consultando Supabase' });
    const solicitudes = await r.json();

    if (!solicitudes.length) {
        return res.status(200).json({ ok: true, solicitudes: 0, detalle: 'Sin solicitudes ayer' });
    }

    const cuerpo = {};
    solicitudes.forEach((s, i) => {
        const est = s.acceso?.estimacion ? ` · Estimado: ₡${s.acceso.estimacion}` : '';
        cuerpo[`${i + 1}. ${s.nombre}`] =
            `Mudanza ${s.fecha_mudanza}${s.urgente ? ' URGENTE' : ''} — ${s.origen} → ${s.destino}${est}${s.pdf_url ? ` · PDF: ${s.pdf_url}` : ''}`;
    });

    const envio = await fetch(`https://formsubmit.co/ajax/${EMAIL_PRINCIPAL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            _subject: `Seguimiento: ${solicitudes.length} solicitud(es) de ayer por confirmar`,
            _template: 'table',
            'Que hacer': 'Verifica en WhatsApp si estos clientes ya escribieron y quedaron cotizados.',
            ...cuerpo,
        }),
    });

    return res.status(200).json({ ok: envio.ok, solicitudes: solicitudes.length });
}
