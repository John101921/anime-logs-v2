create table if not exists dashboard_player_latest (
  player_id bigint primary key,
  snapshot_id bigint not null unique references player_snapshots(id) on delete cascade,
  snapshot_kind text not null,
  player_name text not null,
  cash bigint not null default 0,
  highest_wave integer not null default 0,
  total_kills bigint not null default 0,
  created_at timestamptz not null
);

insert into dashboard_player_latest (
  player_id,
  snapshot_id,
  snapshot_kind,
  player_name,
  cash,
  highest_wave,
  total_kills,
  created_at
)
select distinct on (player_id)
  player_id,
  id as snapshot_id,
  snapshot_kind,
  player_name,
  cash,
  highest_wave,
  total_kills,
  created_at
from player_snapshots
order by player_id, id desc
on conflict (player_id) do update set
  snapshot_id = excluded.snapshot_id,
  snapshot_kind = excluded.snapshot_kind,
  player_name = excluded.player_name,
  cash = excluded.cash,
  highest_wave = excluded.highest_wave,
  total_kills = excluded.total_kills,
  created_at = excluded.created_at
where dashboard_player_latest.snapshot_id < excluded.snapshot_id;

create index if not exists idx_dashboard_player_latest_snapshot_id_desc
on dashboard_player_latest (snapshot_id desc);

create index if not exists idx_dashboard_player_latest_kind_snapshot_id_desc
on dashboard_player_latest (snapshot_kind, snapshot_id desc);

create index if not exists idx_dashboard_player_latest_player_name_trgm
on dashboard_player_latest using gin (player_name gin_trgm_ops);

create or replace function update_dashboard_player_latest()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into dashboard_player_latest (
    player_id,
    snapshot_id,
    snapshot_kind,
    player_name,
    cash,
    highest_wave,
    total_kills,
    created_at
  )
  values (
    new.player_id,
    new.id,
    new.snapshot_kind,
    new.player_name,
    new.cash,
    new.highest_wave,
    new.total_kills,
    new.created_at
  )
  on conflict (player_id) do update set
    snapshot_id = excluded.snapshot_id,
    snapshot_kind = excluded.snapshot_kind,
    player_name = excluded.player_name,
    cash = excluded.cash,
    highest_wave = excluded.highest_wave,
    total_kills = excluded.total_kills,
    created_at = excluded.created_at
  where dashboard_player_latest.snapshot_id < excluded.snapshot_id;

  return new;
end;
$$;

drop trigger if exists trg_update_dashboard_player_latest on player_snapshots;
create trigger trg_update_dashboard_player_latest
after insert on player_snapshots
for each row
execute function update_dashboard_player_latest();

create or replace function get_dashboard_counts()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'players', (select count(*) from dashboard_player_latest),
    'events', (select count(*) from player_events),
    'snapshots', (select count(*) from player_snapshots),
    'purchases', (select count(*) from product_purchases),
    'gifts', (select count(*) from gift_logs),
    'sales', (select count(*) from character_sales),
    'security', (select count(*) from security_events)
  );
$$;

revoke all on function update_dashboard_player_latest() from public;
revoke all on function get_dashboard_counts() from public;
grant execute on function get_dashboard_counts() to service_role;
