-- ============================================================
--  BLINDAJE RLS — MudaFletesRivera
--  Pegar y ejecutar en:  Supabase → SQL Editor → New query
--  Objetivo de este archivo: CERRAR LA LECTURA de datos sensibles.
--  (El anti-spam y los límites de storage van aparte.)
-- ============================================================

-- Contexto: la "anon key" que está en el frontend es PÚBLICA por diseño.
-- Quien controla lo que un anónimo puede hacer NO es esa llave, sino estas
-- políticas RLS. Con RLS activo y sin política que lo permita, la acción
-- queda PROHIBIDA por defecto. Esa es justamente la protección que queremos.


-- ────────────────────────────────────────────────────────────
-- 1) TABLA cotizaciones  →  solo INSERT, NUNCA lectura
-- ────────────────────────────────────────────────────────────
-- Contiene datos personales (nombre, direcciones, coordenadas, enlace al PDF).
-- La app solo INSERTA aquí; jamás lee. Así que cerramos todo menos INSERT.

alter table public.cotizaciones enable row level security;

-- Limpieza por si quedaron políticas viejas con estos nombres
drop policy if exists "anon puede insertar cotizacion" on public.cotizaciones;
drop policy if exists "nadie lee cotizaciones" on public.cotizaciones;

-- Permite crear una cotización (lo que hace el formulario)...
create policy "anon puede insertar cotizacion"
  on public.cotizaciones
  for insert
  to anon
  with check (true);

-- ...y NO creamos ninguna política de SELECT/UPDATE/DELETE.
-- Con RLS activo, la ausencia de política = acción denegada.
-- Resultado: un atacante con la anon key puede mandar una cotización,
-- pero NO puede leer, modificar ni borrar las de nadie.


-- ────────────────────────────────────────────────────────────
-- 2) TABLA mudafletesrivera (reseñas)  →  INSERT + lectura SOLO pública
-- ────────────────────────────────────────────────────────────
-- Estas SÍ se muestran en la web, así que la lectura debe existir.
-- Pero limitamos qué columnas se exponen y bloqueamos editar/borrar.

alter table public.mudafletesrivera enable row level security;

drop policy if exists "anon puede insertar resena" on public.mudafletesrivera;
drop policy if exists "cualquiera lee resenas" on public.mudafletesrivera;

create policy "anon puede insertar resena"
  on public.mudafletesrivera
  for insert
  to anon
  with check (true);

create policy "cualquiera lee resenas"
  on public.mudafletesrivera
  for select
  to anon
  using (true);

-- Sin política de UPDATE ni DELETE: nadie puede alterar ni borrar reseñas
-- existentes (evita que un cracker te sabotee o edite las de otros).

-- IMPORTANTE sobre columnas: RLS filtra FILAS, no COLUMNAS. Si algún día
-- agregás una columna sensible a esta tabla (teléfono, correo, IP...),
-- el select('*') del frontend la expondría. Dos medidas:
--   a) En el frontend, pedí columnas explícitas en vez de '*'
--      (ver docs/seguridad-notas.md).
--   b) Si necesitás guardar algo sensible junto a la reseña, ponelo en
--      OTRA tabla sin política de SELECT, y relacionala por id.


-- ────────────────────────────────────────────────────────────
-- 3) Verificación — corré esto después para confirmar
-- ────────────────────────────────────────────────────────────
-- Debe mostrar rowsecurity = true en ambas tablas:
--   select relname, relrowsecurity
--   from pg_class
--   where relname in ('cotizaciones', 'mudafletesrivera');
--
-- Y lista las políticas activas:
--   select tablename, policyname, cmd, roles
--   from pg_policies
--   where tablename in ('cotizaciones', 'mudafletesrivera');
