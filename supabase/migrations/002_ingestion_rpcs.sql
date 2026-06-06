create or replace function ingest_player_events(events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  accepted uuid[] := '{}';
  duplicates uuid[] := '{}';
  rejected jsonb := '[]'::jsonb;
  event_id uuid;
begin
  for event in select * from jsonb_array_elements(coalesce(events, '[]'::jsonb))
  loop
    begin
      event_id := (event->>'event_id')::uuid;

      insert into player_events (
        source_event_id, event_type, player_id, player_name, cash, highest_wave,
        total_kills, joined_at, left_at, session_duration_seconds, schema_version,
        server_job_id, place_id, occurred_at, payload
      )
      values (
        event_id,
        event->>'event_type',
        (event->'payload'->>'player_id')::bigint,
        event->'payload'->>'player_name',
        coalesce((event->'payload'->>'cash')::bigint, 0),
        coalesce((event->'payload'->>'highest_wave')::integer, 0),
        coalesce((event->'payload'->>'total_kills')::bigint, 0),
        nullif(event->'payload'->>'joined_at', '')::timestamptz,
        nullif(event->'payload'->>'left_at', '')::timestamptz,
        nullif(event->'payload'->>'session_duration_seconds', '')::integer,
        coalesce((event->>'schema_version')::integer, 1),
        event->>'server_job_id',
        nullif(event->>'place_id', '')::bigint,
        (event->>'occurred_at')::timestamptz,
        event->'payload'
      );

      accepted := array_append(accepted, event_id);
    exception
      when unique_violation then
        duplicates := array_append(duplicates, event_id);
      when invalid_text_representation or not_null_violation or check_violation then
        rejected := rejected || jsonb_build_object('event_id', event->>'event_id', 'reason', sqlerrm);
    end;
  end loop;

  return jsonb_build_object('accepted_event_ids', accepted, 'duplicate_event_ids', duplicates, 'rejected', rejected);
end;
$$;

create or replace function ingest_player_snapshots(events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  accepted uuid[] := '{}';
  duplicates uuid[] := '{}';
  rejected jsonb := '[]'::jsonb;
  event_id uuid;
begin
  for event in select * from jsonb_array_elements(coalesce(events, '[]'::jsonb))
  loop
    begin
      event_id := (event->>'event_id')::uuid;

      insert into player_snapshots (
        source_event_id, snapshot_kind, player_id, player_name, cash,
        highest_wave, total_kills, inventory, items, equipped, changed_fields,
        state_hash, profile_version, schema_version, server_job_id, place_id,
        occurred_at, payload
      )
      values (
        event_id,
        case when event->>'event_type' = 'snapshot_full' then 'full' else 'compact' end,
        (event->'payload'->>'player_id')::bigint,
        event->'payload'->>'player_name',
        coalesce((event->'payload'->>'cash')::bigint, 0),
        coalesce((event->'payload'->>'highest_wave')::integer, 0),
        coalesce((event->'payload'->>'total_kills')::bigint, 0),
        coalesce(event->'payload'->'inventory', '[]'::jsonb),
        coalesce(event->'payload'->'items', '[]'::jsonb),
        coalesce(event->'payload'->'equipped', '[]'::jsonb),
        coalesce(event->'payload'->'changed_fields', '{}'::jsonb),
        event->'payload'->>'state_hash',
        nullif(event->'payload'->>'profile_version', '')::bigint,
        coalesce((event->>'schema_version')::integer, 1),
        event->>'server_job_id',
        nullif(event->>'place_id', '')::bigint,
        (event->>'occurred_at')::timestamptz,
        event->'payload'
      );

      accepted := array_append(accepted, event_id);
    exception
      when unique_violation then
        duplicates := array_append(duplicates, event_id);
      when invalid_text_representation or not_null_violation or check_violation then
        rejected := rejected || jsonb_build_object('event_id', event->>'event_id', 'reason', sqlerrm);
    end;
  end loop;

  return jsonb_build_object('accepted_event_ids', accepted, 'duplicate_event_ids', duplicates, 'rejected', rejected);
end;
$$;

create or replace function ingest_purchases(events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  accepted uuid[] := '{}';
  duplicates uuid[] := '{}';
  rejected jsonb := '[]'::jsonb;
  event_id uuid;
begin
  for event in select * from jsonb_array_elements(coalesce(events, '[]'::jsonb))
  loop
    begin
      event_id := (event->>'event_id')::uuid;

      insert into product_purchases (
        source_event_id, purchase_id, player_id, player_name, product_name,
        robux_spent, schema_version, server_job_id, place_id, occurred_at, payload
      )
      values (
        event_id,
        nullif(event->'payload'->>'purchase_id', ''),
        (event->'payload'->>'player_id')::bigint,
        event->'payload'->>'player_name',
        event->'payload'->>'product_name',
        coalesce((event->'payload'->>'robux_spent')::integer, 0),
        coalesce((event->>'schema_version')::integer, 1),
        event->>'server_job_id',
        nullif(event->>'place_id', '')::bigint,
        (event->>'occurred_at')::timestamptz,
        event->'payload'
      );

      accepted := array_append(accepted, event_id);
    exception
      when unique_violation then
        duplicates := array_append(duplicates, event_id);
      when invalid_text_representation or not_null_violation or check_violation then
        rejected := rejected || jsonb_build_object('event_id', event->>'event_id', 'reason', sqlerrm);
    end;
  end loop;

  return jsonb_build_object('accepted_event_ids', accepted, 'duplicate_event_ids', duplicates, 'rejected', rejected);
end;
$$;

create or replace function ingest_gifts(events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  accepted uuid[] := '{}';
  duplicates uuid[] := '{}';
  rejected jsonb := '[]'::jsonb;
  event_id uuid;
begin
  for event in select * from jsonb_array_elements(coalesce(events, '[]'::jsonb))
  loop
    begin
      event_id := (event->>'event_id')::uuid;

      insert into gift_logs (
        source_event_id, giver_id, giver_name, receiver_id, receiver_name,
        character_name, character_id, level, mutation, trait, schema_version,
        server_job_id, place_id, occurred_at, payload
      )
      values (
        event_id,
        (event->'payload'->>'giver_id')::bigint,
        event->'payload'->>'giver_name',
        (event->'payload'->>'receiver_id')::bigint,
        event->'payload'->>'receiver_name',
        event->'payload'->>'character_name',
        event->'payload'->>'character_id',
        coalesce((event->'payload'->>'level')::integer, 0),
        event->'payload'->>'mutation',
        event->'payload'->>'trait',
        coalesce((event->>'schema_version')::integer, 1),
        event->>'server_job_id',
        nullif(event->>'place_id', '')::bigint,
        (event->>'occurred_at')::timestamptz,
        event->'payload'
      );

      accepted := array_append(accepted, event_id);
    exception
      when unique_violation then
        duplicates := array_append(duplicates, event_id);
      when invalid_text_representation or not_null_violation or check_violation then
        rejected := rejected || jsonb_build_object('event_id', event->>'event_id', 'reason', sqlerrm);
    end;
  end loop;

  return jsonb_build_object('accepted_event_ids', accepted, 'duplicate_event_ids', duplicates, 'rejected', rejected);
end;
$$;

create or replace function ingest_sales(events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  accepted uuid[] := '{}';
  duplicates uuid[] := '{}';
  rejected jsonb := '[]'::jsonb;
  event_id uuid;
begin
  for event in select * from jsonb_array_elements(coalesce(events, '[]'::jsonb))
  loop
    begin
      event_id := (event->>'event_id')::uuid;

      insert into character_sales (
        source_event_id, player_id, player_name, sale_type, total_cash_received,
        total_sold, characters, schema_version, server_job_id, place_id, occurred_at, payload
      )
      values (
        event_id,
        (event->'payload'->>'player_id')::bigint,
        event->'payload'->>'player_name',
        event->'payload'->>'sale_type',
        coalesce((event->'payload'->>'total_cash_received')::bigint, 0),
        coalesce((event->'payload'->>'total_sold')::integer, 0),
        coalesce(event->'payload'->'characters', '[]'::jsonb),
        coalesce((event->>'schema_version')::integer, 1),
        event->>'server_job_id',
        nullif(event->>'place_id', '')::bigint,
        (event->>'occurred_at')::timestamptz,
        event->'payload'
      );

      accepted := array_append(accepted, event_id);
    exception
      when unique_violation then
        duplicates := array_append(duplicates, event_id);
      when invalid_text_representation or not_null_violation or check_violation then
        rejected := rejected || jsonb_build_object('event_id', event->>'event_id', 'reason', sqlerrm);
    end;
  end loop;

  return jsonb_build_object('accepted_event_ids', accepted, 'duplicate_event_ids', duplicates, 'rejected', rejected);
end;
$$;

create or replace function ingest_security_events(events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  event jsonb;
  accepted uuid[] := '{}';
  duplicates uuid[] := '{}';
  rejected jsonb := '[]'::jsonb;
  event_id uuid;
begin
  for event in select * from jsonb_array_elements(coalesce(events, '[]'::jsonb))
  loop
    begin
      event_id := (event->>'event_id')::uuid;

      insert into security_events (
        source_event_id, category, severity, player_id, player_name, details,
        schema_version, server_job_id, place_id, occurred_at, payload
      )
      values (
        event_id,
        event->'payload'->>'category',
        event->'payload'->>'severity',
        nullif(event->'payload'->>'player_id', '')::bigint,
        event->'payload'->>'player_name',
        coalesce(event->'payload'->'details', '{}'::jsonb),
        coalesce((event->>'schema_version')::integer, 1),
        event->>'server_job_id',
        nullif(event->>'place_id', '')::bigint,
        (event->>'occurred_at')::timestamptz,
        event->'payload'
      );

      accepted := array_append(accepted, event_id);
    exception
      when unique_violation then
        duplicates := array_append(duplicates, event_id);
      when invalid_text_representation or not_null_violation or check_violation then
        rejected := rejected || jsonb_build_object('event_id', event->>'event_id', 'reason', sqlerrm);
    end;
  end loop;

  return jsonb_build_object('accepted_event_ids', accepted, 'duplicate_event_ids', duplicates, 'rejected', rejected);
end;
$$;

revoke all on function ingest_player_events(jsonb) from public, anon, authenticated;
revoke all on function ingest_player_snapshots(jsonb) from public, anon, authenticated;
revoke all on function ingest_purchases(jsonb) from public, anon, authenticated;
revoke all on function ingest_gifts(jsonb) from public, anon, authenticated;
revoke all on function ingest_sales(jsonb) from public, anon, authenticated;
revoke all on function ingest_security_events(jsonb) from public, anon, authenticated;

grant execute on function ingest_player_events(jsonb) to service_role;
grant execute on function ingest_player_snapshots(jsonb) to service_role;
grant execute on function ingest_purchases(jsonb) to service_role;
grant execute on function ingest_gifts(jsonb) to service_role;
grant execute on function ingest_sales(jsonb) to service_role;
grant execute on function ingest_security_events(jsonb) to service_role;
