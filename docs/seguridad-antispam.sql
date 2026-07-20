-- ============================================================
--  BLINDAJE ANTI-SPAM — MudaFletesRivera
--  Pegar y ejecutar en:  Supabase → SQL Editor → New query
--  Objetivo: que las inserciones SOLO ocurran a través de las Edge
--  Functions (que verifican Turnstile). El navegador pierde el INSERT
--  directo, así que un bot con la anon key ya no puede escribir nada.
--
--  ⚠️  ORDEN IMPORTANTE — ejecutá esto DESPUÉS de:
--     1) supabase secrets set TURNSTILE_SECRET=tu_secret_key
--     2) supabase functions deploy enviar-resena
--     3) supabase functions deploy enviar-cotizacion
--     4) supabase functions deploy firmar-pdf   (si no estaba)
--  Si lo corrés antes, el sitio no podrá guardar hasta que las
--  funciones estén arriba.
-- ============================================================

-- ── Reseñas: quitar INSERT directo del navegador ──
-- (la lectura pública se mantiene; insertar ahora es solo vía enviar-resena)
drop policy if exists "anon puede insertar resena" on public.mudafletesrivera;

-- ── Cotizaciones: quitar INSERT directo del navegador ──
-- (nunca tuvo lectura; insertar ahora es solo vía enviar-cotizacion)
drop policy if exists "anon puede insertar cotizacion" on public.cotizaciones;

-- ── Storage: quitar la SUBIDA directa del navegador ──
-- (subir ahora es solo vía enviar-cotizacion, con service_role)
drop policy if exists "anon sube cotizacion pdf" on storage.objects;


-- ────────────────────────────────────────────────────────────
--  Verificación — después de correr, el rol 'anon' NO debería
--  tener ninguna política de INSERT en estas tablas:
--
--    select tablename, policyname, cmd, roles
--    from pg_policies
--    where tablename in ('mudafletesrivera', 'cotizaciones', 'objects')
--    order by tablename, cmd;
--
--  Esperado:
--    • mudafletesrivera → solo una política SELECT (lectura pública)
--    • cotizaciones     → sin políticas (RLS activo = todo denegado a anon)
--    • objects          → sin política de insert para 'cotizaciones'
-- ────────────────────────────────────────────────────────────


-- ============================================================
--  RESUMEN DE LO QUE QUEDA (defensa en capas):
--
--   Reseña / cotización nueva
--        │  el navegador pide token invisible a Turnstile
--        ▼
--   Edge Function (enviar-resena / enviar-cotizacion)
--        │  verifica el token con Cloudflare (secreto server-side)
--        │  sanea y limita los campos
--        ▼
--   INSERT con service_role  ──►  base de datos
--
--   Un bot que llame directo a la base con la anon key: RECHAZADO
--   (no tiene política de insert).
--   Un bot que llame directo a la función sin token válido: RECHAZADO
--   (falla la verificación de Turnstile).
-- ============================================================
