-- DevFolio Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Portfolios table
create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  name text not null,
  title text,
  bio text,
  skills text[] default '{}',
  education jsonb default '[]',
  experience jsonb default '[]',
  contact jsonb default '{}',
  theme text default 'default',
  is_published boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  title text not null,
  description text,
  tags text[] default '{}',
  live_url text,
  github_url text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.projects enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can insert their own profile" 
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

create policy "Users can delete own profile" 
  on public.profiles for delete using (auth.uid() = id);

-- Portfolios policies
create policy "Published portfolios are viewable by everyone" 
  on public.portfolios for select using (is_published = true or auth.uid() = user_id);

create policy "Users can insert own portfolio" 
  on public.portfolios for insert with check (auth.uid() = user_id);

create policy "Users can update own portfolio" 
  on public.portfolios for update using (auth.uid() = user_id);

create policy "Users can delete own portfolio" 
  on public.portfolios for delete using (auth.uid() = user_id);

-- Projects policies
create policy "Projects are viewable with published portfolio" 
  on public.projects for select using (
    exists (
      select 1 from public.portfolios 
      where id = portfolio_id and (is_published = true or user_id = auth.uid())
    )
  );

create policy "Users can insert own projects" 
  on public.projects for insert with check (
    exists (
      select 1 from public.portfolios 
      where id = portfolio_id and user_id = auth.uid()
    )
  );

create policy "Users can update own projects" 
  on public.projects for update using (
    exists (
      select 1 from public.portfolios 
      where id = portfolio_id and user_id = auth.uid()
    )
  );

create policy "Users can delete own projects" 
  on public.projects for delete using (
    exists (
      select 1 from public.portfolios 
      where id = portfolio_id and user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index idx_profiles_username on public.profiles(username);
create index idx_portfolios_user_id on public.portfolios(user_id);
create index idx_projects_portfolio_id on public.projects(portfolio_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
