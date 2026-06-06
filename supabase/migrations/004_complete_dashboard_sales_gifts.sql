create index if not exists idx_gift_logs_giver_name_trgm
on gift_logs using gin (giver_name gin_trgm_ops);

create index if not exists idx_gift_logs_receiver_name_trgm
on gift_logs using gin (receiver_name gin_trgm_ops);

create index if not exists idx_gift_logs_character_name_trgm
on gift_logs using gin (character_name gin_trgm_ops);

create index if not exists idx_gift_logs_character_id_trgm
on gift_logs using gin (character_id gin_trgm_ops);

create index if not exists idx_character_sales_player_name_trgm
on character_sales using gin (player_name gin_trgm_ops);

create index if not exists idx_character_sales_sale_type_trgm
on character_sales using gin (sale_type gin_trgm_ops);

create or replace view ingest_health_summary as
select
  (select count(*) from player_events where created_at > now() - interval '1 hour') as player_events_last_hour,
  (select count(*) from player_snapshots where created_at > now() - interval '1 hour') as snapshots_last_hour,
  (select count(*) from product_purchases where created_at > now() - interval '1 hour') as purchases_last_hour,
  (select count(*) from gift_logs where created_at > now() - interval '1 hour') as gifts_last_hour,
  (select count(*) from character_sales where created_at > now() - interval '1 hour') as sales_last_hour,
  (select count(*) from security_events where created_at > now() - interval '1 hour') as security_events_last_hour,
  greatest(
    coalesce((select max(created_at) from player_events), 'epoch'::timestamptz),
    coalesce((select max(created_at) from player_snapshots), 'epoch'::timestamptz),
    coalesce((select max(created_at) from product_purchases), 'epoch'::timestamptz),
    coalesce((select max(created_at) from gift_logs), 'epoch'::timestamptz),
    coalesce((select max(created_at) from character_sales), 'epoch'::timestamptz),
    coalesce((select max(created_at) from security_events), 'epoch'::timestamptz)
  ) as last_ingested_at;
