-- ReAnker (reanker.com) DB スキーマ

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  google_id text unique not null,
  email text not null,
  name text,
  plan text not null default 'free',
  slack_webhook_url text,
  notify_email text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

create table if not exists pick_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('service', 'keyword', 'domain')),
  query_value text not null,
  sources text[] not null default array['prtimes', 'googlenews'],
  notify_slack boolean default true,
  notify_email boolean default false,
  warmup_until timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  pickkw_id uuid references pick_keywords(id) on delete cascade,
  source text not null check (source in ('prtimes', 'googlenews')),
  title text not null,
  url text unique not null,
  summary text,
  published_at date not null,
  published_hour integer,
  is_read boolean default false,
  is_clipped boolean default false,
  notified boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now()
);

-- 既存テーブル向けマイグレーション
alter table items add column if not exists is_clipped boolean default false;
alter table items add column if not exists deleted_at timestamptz;
alter table items add column if not exists category text default 'その他';
alter table items add column if not exists importance text default '中';
alter table items add column if not exists ai_summary text;
alter table items add column if not exists importance_reason text;

-- レポートテーブル（週次・月次サマリ）
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text not null check (type in ('weekly', 'monthly')),
  period_start date not null,
  period_end date not null,
  title text not null,
  summary text,
  total_items integer default 0,
  unread_items integer default 0,
  top_anchor_name text,
  top_category text,
  highlights jsonb default '[]'::jsonb,
  anchor_summaries jsonb default '[]'::jsonb,
  category_counts jsonb default '{}'::jsonb,
  notable_items jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create unique index if not exists idx_reports_user_type_period
  on reports(user_id, type, period_start);

-- インデックス
create index if not exists idx_items_pickkw_id on items(pickkw_id);
create index if not exists idx_items_published_at on items(published_at);
create index if not exists idx_items_notified on items(notified);
create index if not exists idx_items_is_clipped on items(is_clipped);
create index if not exists idx_items_deleted_at on items(deleted_at);
create index if not exists idx_items_category on items(category);
create index if not exists idx_items_importance on items(importance);
create index if not exists idx_reports_user_id on reports(user_id);
create index if not exists idx_reports_type on reports(type);
create index if not exists idx_pick_keywords_user_id on pick_keywords(user_id);

-- Row Level Security
alter table users enable row level security;
alter table pick_keywords enable row level security;
alter table items enable row level security;

create policy "Users can view own data" on users
  for select using (id = auth.uid()::uuid);

create policy "Users can update own data" on users
  for update using (id = auth.uid()::uuid);

create policy "Users can view own keywords" on pick_keywords
  for all using (user_id = auth.uid()::uuid);

create policy "Users can view own items" on items
  for select using (
    pickkw_id in (select id from pick_keywords where user_id = auth.uid()::uuid)
  );

create policy "Users can update own items" on items
  for update using (
    pickkw_id in (select id from pick_keywords where user_id = auth.uid()::uuid)
  );
