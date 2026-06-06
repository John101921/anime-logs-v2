create extension if not exists pgcrypto;

create table if not exists player_events (
  id bigserial primary key,
  source_event_id uuid not null unique,
  event_type text not null check (event_type in ('join', 'leave')),
  player_id bigint not null,
  player_name text not null,
  cash bigint not null default 0,
  highest_wave integer not null default 0,
  total_kills bigint not null default 0,
  joined_at timestamptz,
  left_at timestamptz,
  session_duration_seconds integer,
  schema_version integer not null default 1,
  server_job_id text,
  place_id bigint,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists player_snapshots (
  id bigserial primary key,
  source_event_id uuid not null unique,
  snapshot_kind text not null check (snapshot_kind in ('full', 'compact')),
  player_id bigint not null,
  player_name text not null,
  cash bigint not null default 0,
  highest_wave integer not null default 0,
  total_kills bigint not null default 0,
  inventory jsonb not null default '[]'::jsonb,
  items jsonb not null default '[]'::jsonb,
  equipped jsonb not null default '[]'::jsonb,
  changed_fields jsonb not null default '{}'::jsonb,
  state_hash text,
  profile_version bigint,
  schema_version integer not null default 1,
  server_job_id text,
  place_id bigint,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists product_purchases (
  id bigserial primary key,
  source_event_id uuid not null unique,
  purchase_id text unique,
  player_id bigint not null,
  player_name text not null,
  product_name text not null,
  robux_spent integer not null default 0,
  schema_version integer not null default 1,
  server_job_id text,
  place_id bigint,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists gift_logs (
  id bigserial primary key,
  source_event_id uuid not null unique,
  giver_id bigint not null,
  giver_name text not null,
  receiver_id bigint not null,
  receiver_name text not null,
  character_name text,
  character_id text,
  level integer not null default 0,
  mutation text,
  trait text,
  schema_version integer not null default 1,
  server_job_id text,
  place_id bigint,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists character_sales (
  id bigserial primary key,
  source_event_id uuid not null unique,
  player_id bigint not null,
  player_name text not null,
  sale_type text,
  total_cash_received bigint not null default 0,
  total_sold integer not null default 0,
  characters jsonb not null default '[]'::jsonb,
  schema_version integer not null default 1,
  server_job_id text,
  place_id bigint,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists security_events (
  id bigserial primary key,
  source_event_id uuid not null unique,
  category text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  player_id bigint,
  player_name text,
  details jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  server_job_id text,
  place_id bigint,
  occurred_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_player_events_player_id_created_at on player_events (player_id, created_at desc);
create index if not exists idx_player_events_occurred_at on player_events (occurred_at desc);
create index if not exists idx_player_events_type_created_at on player_events (event_type, created_at desc);

create index if not exists idx_player_snapshots_player_id_created_at on player_snapshots (player_id, created_at desc);
create index if not exists idx_player_snapshots_kind_created_at on player_snapshots (snapshot_kind, created_at desc);
create index if not exists idx_player_snapshots_occurred_at on player_snapshots (occurred_at desc);

create index if not exists idx_product_purchases_player_id_created_at on product_purchases (player_id, created_at desc);
create index if not exists idx_product_purchases_created_at on product_purchases (created_at desc);

create index if not exists idx_gift_logs_giver_created_at on gift_logs (giver_id, created_at desc);
create index if not exists idx_gift_logs_receiver_created_at on gift_logs (receiver_id, created_at desc);

create index if not exists idx_character_sales_player_created_at on character_sales (player_id, created_at desc);
create index if not exists idx_security_events_player_created_at on security_events (player_id, created_at desc);
create index if not exists idx_security_events_severity_created_at on security_events (severity, created_at desc);

alter table player_events enable row level security;
alter table player_snapshots enable row level security;
alter table product_purchases enable row level security;
alter table gift_logs enable row level security;
alter table character_sales enable row level security;
alter table security_events enable row level security;

create or replace view latest_player_snapshots as
select distinct on (player_id)
  id,
  player_id,
  player_name,
  snapshot_kind,
  cash,
  highest_wave,
  total_kills,
  inventory,
  items,
  equipped,
  changed_fields,
  state_hash,
  profile_version,
  occurred_at,
  created_at
from player_snapshots
order by player_id, occurred_at desc, id desc;

create or replace view player_revenue_summary as
select
  player_id,
  player_name,
  count(*) as purchase_count,
  coalesce(sum(robux_spent), 0) as total_robux_spent,
  max(created_at) as last_purchase_at
from product_purchases
group by player_id, player_name;
