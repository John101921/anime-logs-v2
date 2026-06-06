create or replace function get_dashboard_counts()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'players', (select count(distinct player_id) from player_snapshots),
    'events', (select count(*) from player_events),
    'snapshots', (select count(*) from player_snapshots),
    'purchases', (select count(*) from product_purchases),
    'gifts', (select count(*) from gift_logs),
    'sales', (select count(*) from character_sales),
    'security', (select count(*) from security_events)
  );
$$;

revoke all on function get_dashboard_counts() from public;
grant execute on function get_dashboard_counts() to service_role;
