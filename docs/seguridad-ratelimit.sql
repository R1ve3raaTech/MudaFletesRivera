-- ============================================================
--  LÍMITE DE ENVÍOS POR IP — MudaFletesRivera
--  Pegar y ejecutar en:  Supabase → SQL Editor → New query
--  Objetivo: frenar a alguien que insiste manualmente con un navegador
--  real (pasando Turnstile cada vez), no solo a bots.
-- ============================================================

-- Un registro por cada envío aceptado (cotización o reseña). Las Edge
-- Functions cuentan cuántos hay por IP+ruta en los últimos 10 minutos
-- antes de dejar pasar uno nuevo (ver supabase/functions/_shared/rateLimit.ts).

create table if not exists public.rate_limits (
    id bigint generated always as identity primary key,
    ip text not null,
    ruta text not null,
    created_at timestamptz not null default now()
);

create index if not exists rate_limits_ip_ruta_created_idx
    on public.rate_limits (ip, ruta, created_at desc);

-- RLS activo y SIN políticas: solo las Edge Functions (con service_role,
-- que ignora RLS) pueden leer o escribir esta tabla. El rol anon no tiene
-- ningún acceso.
alter table public.rate_limits enable row level security;

-- Housekeeping opcional: borra registros de más de un día para que la
-- tabla no crezca indefinidamente. Podés correr esto a mano de vez en
-- cuando, o programarlo con pg_cron si tu plan de Supabase lo incluye.
-- delete from public.rate_limits where created_at < now() - interval '1 day';
