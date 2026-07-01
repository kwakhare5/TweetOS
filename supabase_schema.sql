-- 1. Create profiles table
create table if not exists public.profiles (
  id text primary key default 'default',
  name text,
  twitter_handle text,
  niche text,
  bio text,
  content_pillars jsonb,
  voice jsonb,
  audience jsonb,
  goals jsonb,
  admired_accounts jsonb,
  posting_frequency text,
  second_brain text,
  inspirations_context text,
  gemini_api_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create public access policies
create policy "Allow read access to profiles" on public.profiles for select using (true);
create policy "Allow insert access to profiles" on public.profiles for insert with check (true);
create policy "Allow update access to profiles" on public.profiles for update using (true);
create policy "Allow delete access to profiles" on public.profiles for delete using (true);

-- 2. Create drafts table
create table if not exists public.drafts (
  id text primary key,
  content text,
  is_thread boolean default false,
  thread_tweets jsonb,
  pillar_id text,
  moment_type text,
  hook_variations jsonb,
  algorithm_score jsonb,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.drafts enable row level security;

-- Create public access policies
create policy "Allow read access to drafts" on public.drafts for select using (true);
create policy "Allow insert access to drafts" on public.drafts for insert with check (true);
create policy "Allow update access to drafts" on public.drafts for update using (true);
create policy "Allow delete access to drafts" on public.drafts for delete using (true);
