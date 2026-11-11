create extension if not exists pgcrypto;

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  category text not null default 'Outros' check (char_length(category) between 1 and 80),
  description text not null default '' check (char_length(description) <= 500),
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx
  on public.transactions (user_id, date desc);

create table public.budgets (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category text not null check (char_length(category) between 1 and 80),
  "limit" numeric(14, 2) not null check ("limit" > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, category)
);

alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

revoke all on table public.transactions from anon, authenticated;
revoke all on table public.budgets from anon, authenticated;
grant select, insert, update, delete on table public.transactions to authenticated;
grant select, insert, update, delete on table public.budgets to authenticated;

create policy "Users can read their own transactions"
  on public.transactions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own transactions"
  on public.transactions for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own budgets"
  on public.budgets for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own budgets"
  on public.budgets for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own budgets"
  on public.budgets for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own budgets"
  on public.budgets for delete to authenticated
  using ((select auth.uid()) = user_id);
