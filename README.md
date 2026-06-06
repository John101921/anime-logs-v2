# Anime Logs v2

Clean rebuild for Roblox log ingestion and dashboard.

## Current Contents

- `supabase/migrations/001_logging_schema.sql`
- `supabase/migrations/002_ingestion_rpcs.sql`
- `supabase/functions/ingest/index.ts`

## Setup Order

1. Run `001_logging_schema.sql` in Supabase SQL Editor.
2. Run `002_ingestion_rpcs.sql` in Supabase SQL Editor.
3. Deploy the Edge Function named `ingest`.
4. Set Edge Function secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ROBLOX_API_SECRET`
5. Smoke-test duplicate `event_id`.
6. Update Roblox `DashboardConfig.BaseUrl` to:
   `https://YOUR_PROJECT_REF.supabase.co`
7. Update Roblox `DashboardConfig.IngestEndpoint` to:
   `/functions/v1/ingest`

## Smoke Test

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/ingest" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ROBLOX_API_SECRET" \
  -d '{
    "schema_version": 1,
    "events": [
      {
        "event_id": "11111111-1111-4111-8111-111111111111",
        "event_type": "join",
        "schema_version": 1,
        "occurred_at": "2026-06-06T12:00:00Z",
        "server_job_id": "test-job",
        "place_id": 123456,
        "payload": {
          "player_id": 123,
          "player_name": "TestPlayer",
          "cash": 100,
          "highest_wave": 5,
          "total_kills": 20,
          "joined_at": "2026-06-06T12:00:00Z"
        }
      }
    ]
  }'
```

Run the same request twice:

- First response should include the ID in `accepted_event_ids`.
- Second response should include the ID in `duplicate_event_ids`.
