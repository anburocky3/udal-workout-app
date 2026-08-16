-- 1. Profiles Table (Linked to Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  gender text,
  age int,
  avatar text,
  height_cm numeric,
  starting_weight_kg numeric,
  activity_level text,
  weekly_loss_goal_kg numeric,
  target_calories int,
  target_protein_g int,
  target_carbs_g int,
  target_fat_g int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Weekly Weight Logs (One-to-Many relationship)
create table public.weekly_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  log_date date not null default current_date,
  weight_kg numeric not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security) so users only see their own data
alter table public.profiles enable row level security;
alter table public.weekly_logs enable row level security;
alter table public.weekly_logs 
add column waist_cm numeric,
add column chest_cm numeric;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can view own logs" on weekly_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on weekly_logs for insert with check (auth.uid() = user_id);