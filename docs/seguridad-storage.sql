-- ============================================================
--  BLINDAJE STORAGE — MudaFletesRivera
--  Pegar y ejecutar en:  Supabase → SQL Editor → New query
--  Objetivo: hacer el bucket 'cotizaciones' PRIVADO y anti-relleno.
--  Va junto con la Edge Function 'firmar-pdf' y con seguridad-rls.sql.
-- ============================================================

-- Antes: el bucket era público → cualquiera con la URL (adivinable:
-- <timestamp>-<nombre>.pdf) podía leer PDFs con las direcciones de los
-- clientes. Después de esto: el navegador solo puede SUBIR; para LEER un
-- PDF hace falta un enlace firmado que solo genera la Edge Function
-- (con la service_role key, que nunca sale del servidor).


-- ────────────────────────────────────────────────────────────
-- 1) Bucket privado + límites (anti-relleno de almacenamiento)
-- ────────────────────────────────────────────────────────────
update storage.buckets
set
    public = false,                                 -- ya no hay lectura pública
    file_size_limit = 5242880,                      -- 5 MB máx por archivo
    allowed_mime_types = array['application/pdf']   -- solo PDFs
where id = 'cotizaciones';


-- ────────────────────────────────────────────────────────────
-- 2) Políticas sobre los archivos (storage.objects)
--    storage.objects YA tiene RLS activo por defecto en Supabase.
-- ────────────────────────────────────────────────────────────

-- Limpieza de políticas viejas con estos nombres
drop policy if exists "anon sube cotizacion pdf" on storage.objects;
drop policy if exists "sin lectura anon de cotizaciones" on storage.objects;

-- Permite SUBIR al bucket 'cotizaciones' (lo que hace el formulario)...
create policy "anon sube cotizacion pdf"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'cotizaciones');

-- ...y NO creamos políticas de SELECT / UPDATE / DELETE para anon.
-- Con RLS activo, sin política = denegado. Resultado:
--   • Un atacante puede subir un PDF, pero limitado a 5 MB y solo PDF.
--   • NO puede leer, listar, sobrescribir ni borrar los PDFs de nadie.
--   • Para leer un PDF hay que pasar por la Edge Function 'firmar-pdf'.


-- ────────────────────────────────────────────────────────────
-- 3) Verificación
-- ────────────────────────────────────────────────────────────
-- El bucket debe salir con public = false y los límites puestos:
--   select id, public, file_size_limit, allowed_mime_types
--   from storage.buckets where id = 'cotizaciones';
--
-- Políticas activas sobre storage.objects:
--   select policyname, cmd, roles from pg_policies
--   where tablename = 'objects' and schemaname = 'storage';


-- ============================================================
--  RECORDATORIO — falta desplegar la Edge Function:
--    supabase functions deploy firmar-pdf
--  (código en supabase/functions/firmar-pdf/index.ts)
-- ============================================================
