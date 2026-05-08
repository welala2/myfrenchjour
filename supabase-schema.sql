-- MyFrenchJour database schema
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/multgmwqexgkyhbgnvlx/sql

-- Word marks (known / review per user)
create table if not exists word_marks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  word_key text not null,
  status text not null check (status in ('known', 'review')),
  updated_at timestamptz default now(),
  unique(user_id, word_key)
);

-- Quiz cards (SRS data per user per word)
create table if not exists quiz_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  word_key text not null,
  ease_factor float default 2.5,
  interval int default 1,
  repetitions int default 0,
  next_review timestamptz default now(),
  last_quality int default 0,
  updated_at timestamptz default now(),
  unique(user_id, word_key)
);

-- Row Level Security: users can only see and edit their own data
alter table word_marks enable row level security;
alter table quiz_cards enable row level security;

create policy "Users can manage their own word marks"
  on word_marks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own quiz cards"
  on quiz_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for fast queries
create index if not exists word_marks_user_id_idx on word_marks(user_id);
create index if not exists quiz_cards_user_id_idx on quiz_cards(user_id);
create index if not exists quiz_cards_next_review_idx on quiz_cards(user_id, next_review);
