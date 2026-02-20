-- Chat threads table
create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Chat messages table
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.chat_threads(id) on delete cascade not null,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  provider text,
  model text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_chat_threads_user_id on public.chat_threads(user_id);
create index idx_chat_messages_thread_id on public.chat_messages(thread_id);
create index idx_chat_messages_thread_created on public.chat_messages(thread_id, created_at);

-- RLS
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

create policy "Users can manage their own threads"
  on public.chat_threads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage messages in their own threads"
  on public.chat_messages for all
  using (thread_id in (select id from public.chat_threads where user_id = auth.uid()))
  with check (thread_id in (select id from public.chat_threads where user_id = auth.uid()));

-- Auto-update updated_at trigger
create or replace function public.update_chat_thread_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger chat_thread_updated_at
  before update on public.chat_threads
  for each row
  execute function public.update_chat_thread_updated_at();
