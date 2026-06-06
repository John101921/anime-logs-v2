create index if not exists idx_player_snapshots_id_desc
on player_snapshots (id desc);

create index if not exists idx_player_snapshots_kind_id_desc
on player_snapshots (snapshot_kind, id desc);

create index if not exists idx_player_snapshots_player_id_id_desc
on player_snapshots (player_id, id desc);
