// Cron diario (Vercel): recuerda las mudanzas de los próximos 3 días.
// Envía correo a la administradora y al encargado de mudanzas.
// Requiere en Vercel las variables de entorno:
//   SUPABASE_URL          → URL del proyecto Supabase
//   SUPABASE_SERVICE_KEY  → service_role key (Settings > API)
//   CRON_SECRET           → (opcional pero recomendado) protege el endpoint

const EMAIL_PRINCIPAL = 'thecamil999@gmail.com';
const EMAIL_MUDANZAS = 'camiloritrujillo@gmail.com';

export default async function handler(req, res) {
    if (process.env.CRON_SECRET &&
        req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return res.status(500).json({ error: 'Faltan variables de entorno de Supabase' });

    const hoy = new Date().toISOString().slice(0, 10);
    const en3dias = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

    const r = await fetch(
        `${url}/rest/v1/cotizaciones?fecha_mudanza=gte.${hoy}&fecha_mudanza=lte.${en3dias}&order=fecha_mudanza.asc&select=nombre,origen,destino,fecha_mudanza,urgente,pdf_url,acceso`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!r.ok) return res.status(502).json({ error: 'Error consultando Supabase' });
    const mudanzas = await r.json();

    if (!mudanzas.length) {
        return res.status(200).json({ ok: true, mudanzas: 0, detalle: 'Sin mudanzas próximas' });
    }

    const cuerpo = {};
    mudanzas.forEach((m, i) => {
        const pdf = m.pdf_url ? ` · PDF: ${m.pdf_url}` : '';
        cuerpo[`${i + 1}. ${m.fecha_mudanza}${m.urgente ? ' (URGENTE)' : ''}`] =
            `${m.nombre} — Cargar: ${m.origen} — Descargar: ${m.destino}${pdf}`;
    });

    const envio = await fetch(`https://formsubmit.co/ajax/${EMAIL_PRINCIPAL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            _subject: `Recordatorio: ${mudanzas.length} mudanza(s) en los próximos 3 días`,
            _template: 'table',
            _cc: EMAIL_MUDANZAS,
            ...cuerpo,
        }),
    });

    return res.status(200).json({ ok: envio.ok, mudanzas: mudanzas.length });
}
