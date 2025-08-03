create extension if not exists "uuid-ossp";

create table public.post (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  original text not null,
  advice text not null,
  corrected text not null,
  translated text not null,
  created_at timestamptz default now()
);

create index idx_post_created_at on public.post (created_at 
desc);
