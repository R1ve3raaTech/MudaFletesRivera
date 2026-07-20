// Cloudflare Turnstile — obtención de token del lado del cliente.
// El token que devuelve se manda a la Edge Function, que lo verifica con
// Cloudflare antes de escribir en la base. Un bot que llame directo a la
// función sin un token válido queda rechazado.
//
// La SITE KEY es pública (va en el navegador, no es secreto). La SECRET KEY
// vive solo en Supabase. Mientras no configures la tuya, usamos la llave de
// PRUEBA de Cloudflare que siempre pasa, para no bloquear el desarrollo.
//   Producción: definí VITE_TURNSTILE_SITE_KEY en tu .env / hosting.

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise = null;

function cargarScript() {
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
        if (window.turnstile) return resolve();
        const s = document.createElement('script');
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('No se pudo cargar Turnstile'));
        document.head.appendChild(s);
    });
    return scriptPromise;
}

// Resuelve con un token de un solo uso. Renderiza un widget invisible en un
// contenedor temporal y lo limpia al terminar (así cada envío usa un token
// fresco, que es como Turnstile espera que se use).
export async function obtenerTokenTurnstile() {
    await cargarScript();
    return new Promise((resolve, reject) => {
        const cont = document.createElement('div');
        cont.style.display = 'none';
        document.body.appendChild(cont);

        let id;
        const limpiar = () => {
            try { window.turnstile.remove(id); } catch { /* ya removido */ }
            cont.remove();
        };

        try {
            id = window.turnstile.render(cont, {
                sitekey: SITE_KEY,
                size: 'invisible',
                callback: (token) => { limpiar(); resolve(token); },
                'error-callback': () => { limpiar(); reject(new Error('Turnstile falló')); },
                'timeout-callback': () => { limpiar(); reject(new Error('Turnstile expiró')); },
            });
        } catch (e) {
            limpiar();
            reject(e);
        }
    });
}
