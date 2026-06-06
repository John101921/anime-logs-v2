create extension if not exists pg_trgm;

create index if not exists idx_player_events_player_name_trgm
on player_events using gin (player_name gin_trgm_ops);

create index if not exists idx_player_snapshots_player_name_trgm
on player_snapshots using gin (player_name gin_trgm_ops);

create index if not exists idx_product_purchases_player_name_trgm
on product_purchases using gin (player_name gin_trgm_ops);

create index if not exists idx_product_purchases_product_name_trgm
on product_purchases using gin (product_name gin_trgm_ops);

create index if not exists idx_product_purchases_purchase_id_trgm
on product_purchases using gin (purchase_id gin_trgm_ops);

create index if not exists idx_security_events_player_name_trgm
on security_events using gin (player_name gin_trgm_ops);

create index if not exists idx_security_events_category_trgm
on security_events using gin (category gin_trgm_ops);

create or replace view ingest_health_summary as
select
  (select count(*) from player_events where created_at > now() - interval '1 hour') as player_events_last_hour,
  (select count(*) from player_snapshots where created_at > now() - interval '1 hour') as snapshots_last_hour,
  (select count(*) from product_purchases where created_at > now() - interval '1 hour') as purchases_last_hour,
  (select count(*) from security_events where created_at > now() - interval '1 hour') as security_events_last_hour,
  greatest(
    coalesce((select max(created_at) from player_events), 'epoch'::timestamptz),
    coalesce((select max(created_at) from player_snapshots), 'epoch'::timestamptz),
    coalesce((select max(created_at) from product_purchases), 'epoch'::timestamptz),
    coalesce((select max(created_at) from security_events), 'epoch'::timestamptz)
  ) as last_ingested_at;
