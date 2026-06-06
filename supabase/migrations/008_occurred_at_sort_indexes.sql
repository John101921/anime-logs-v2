create index if not exists idx_product_purchases_occurred_at_desc
on product_purchases (occurred_at desc);

create index if not exists idx_gift_logs_occurred_at_desc
on gift_logs (occurred_at desc);

create index if not exists idx_character_sales_occurred_at_desc
on character_sales (occurred_at desc);

create index if not exists idx_security_events_occurred_at_desc
on security_events (occurred_at desc);
