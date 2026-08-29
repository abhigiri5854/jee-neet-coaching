-- PrepXpert schema, RLS, storage policies and helper functions
create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'admin');
create type public.counselling_status as enum ('new', 'contacted', 'scheduled', 'completed', 'cancelled');
create type public.batch_status as enum ('active', 'upcoming', 'completed');
create type public.enrollment_status as enum ('active', 'pending', 'cancelled');
create type public.request_type as enum ('counselling', 'demo');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'student',
  avatar_url text,
  class_level text,
  target_exam text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subject text not null,
  qualification text not null,
  experience_years integer not null default 0 check (experience_years >= 0),
  rating numeric(2,1) not null default 4.8 check (rating >= 0 and rating <= 5),
  short_bio text not null,
  bio text not null,
  photo_path text not null default '/images/teachers/placeholder.svg',
  achievements text[] not null default '{}',
  subjects text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null,
  exam text not null,
  class_level text not null,
  duration_months integer not null check (duration_months > 0),
  original_price integer not null check (original_price >= 0),
  price integer not null check (price >= 0),
  image_path text not null default '/images/courses/placeholder.svg',
  teacher_id uuid references public.teachers(id) on delete set null,
  features text[] not null default '{}',
  syllabus text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  is_popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0
);

create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  duration_minutes integer not null default 45,
  sort_order integer not null default 0
);

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  exam text not null,
  class_level text not null,
  start_date date not null,
  schedule text not null,
  seats_total integer not null check (seats_total > 0),
  seats_available integer not null check (seats_available >= 0),
  status public.batch_status not null default 'upcoming',
  teacher_id uuid references public.teachers(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.sample_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  exam text not null,
  subject text not null,
  class_level text not null,
  year integer not null,
  difficulty text not null,
  paper_type text not null,
  question_count integer not null,
  duration_minutes integer not null,
  file_path text not null,
  solution_file_path text,
  file_size integer not null default 0,
  description text,
  is_published boolean not null default false,
  download_count integer not null default 0,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_sample_papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  paper_id uuid not null references public.sample_papers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, paper_id)
);

create table public.counselling_requests (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  phone text not null,
  class_target text not null,
  preferred_mode text not null,
  location text not null,
  preferred_time text,
  user_id uuid references public.profiles(id) on delete set null,
  request_type public.request_type not null default 'counselling',
  course_id uuid references public.courses(id) on delete set null,
  status public.counselling_status not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status public.enrollment_status not null default 'active',
  price_at_enrollment integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  status_label text not null,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  photo_path text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.teachers(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  student_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  check (teacher_id is not null or course_id is not null)
);

create table public.download_logs (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.sample_papers(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  visitor_key text not null,
  created_at timestamptz not null default now()
);

create table public.view_logs (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid not null references public.sample_papers(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  visitor_key text not null,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id text primary key default 'default',
  counselling_hours text default '10:00 AM – 8:00 PM IST',
  support_email text default 'support@prepxpert.in',
  support_phone text default '+91 98765 43210',
  updated_at timestamptz not null default now()
);

create index idx_courses_published on public.courses (is_published, is_popular);
create index idx_courses_slug on public.courses (slug);
create index idx_teachers_slug on public.teachers (slug);
create index idx_papers_filters on public.sample_papers (exam, subject, class_level, year, is_published);
create index idx_papers_slug on public.sample_papers (slug);
create index idx_batches_status on public.batches (status, start_date);
create index idx_enrollments_user on public.enrollments (user_id);
create index idx_saved_papers_user on public.saved_sample_papers (user_id);
create index idx_counselling_status on public.counselling_requests (status, created_at desc);
create index idx_download_logs_dedupe on public.download_logs (paper_id, visitor_key, created_at);
create index idx_view_logs_dedupe on public.view_logs (paper_id, visitor_key, created_at);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();
create trigger trg_teachers_updated before update on public.teachers
for each row execute function public.set_updated_at();
create trigger trg_courses_updated before update on public.courses
for each row execute function public.set_updated_at();
create trigger trg_papers_updated before update on public.sample_papers
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'student'::public.user_role
);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

create or replace function public.enforce_enrollment_price()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_price integer;
begin
  select price into v_price from public.courses where id = new.course_id and is_published = true;
  if v_price is null then
    raise exception 'Course is not available for enrollment';
  end if;
  new.price_at_enrollment := v_price;
  new.user_id := auth.uid();
  return new;
end;
$$;

create trigger trg_enrollment_price
  before insert on public.enrollments
  for each row execute function public.enforce_enrollment_price();

create or replace function public.track_paper_view(p_paper_id uuid, p_visitor_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.sample_papers
    where id = p_paper_id and is_published = true
  ) is not true then
    return;
  end if;

  if exists (
    select 1 from public.view_logs
    where paper_id = p_paper_id
      and visitor_key = p_visitor_key
      and created_at > now() - interval '6 hours'
  ) then
    return;
  end if;

  insert into public.view_logs (paper_id, user_id, visitor_key)
  values (p_paper_id, auth.uid(), p_visitor_key);

  update public.sample_papers
  set view_count = view_count + 1
  where id = p_paper_id;
end;
$$;

create or replace function public.track_paper_download(p_paper_id uuid, p_visitor_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.sample_papers
    where id = p_paper_id and is_published = true
  ) is not true then
    return;
  end if;

  if exists (
    select 1 from public.download_logs
    where paper_id = p_paper_id
      and visitor_key = p_visitor_key
      and created_at > now() - interval '30 minutes'
  ) then
    return;
  end if;

  insert into public.download_logs (paper_id, user_id, visitor_key)
  values (p_paper_id, auth.uid(), p_visitor_key);

  update public.sample_papers
  set download_count = download_count + 1
  where id = p_paper_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.teachers enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.batches enable row level security;
alter table public.sample_papers enable row level security;
alter table public.saved_sample_papers enable row level security;
alter table public.counselling_requests enable row level security;
alter table public.enrollments enable row level security;
alter table public.testimonials enable row level security;
alter table public.reviews enable row level security;
alter table public.download_logs enable row level security;
alter table public.view_logs enable row level security;
alter table public.site_settings enable row level security;

create policy "public read published teachers" on public.teachers
  for select using (is_published = true or public.is_admin());
create policy "admin manage teachers" on public.teachers
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published courses" on public.courses
  for select using (is_published = true or public.is_admin());
create policy "admin manage courses" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read modules of published courses" on public.course_modules
  for select using (
    exists (select 1 from public.courses c where c.id = course_id and (c.is_published or public.is_admin()))
  );
create policy "admin manage modules" on public.course_modules
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read lessons" on public.course_lessons
  for select using (
    exists (
      select 1 from public.course_modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and (c.is_published or public.is_admin())
    )
  );
create policy "admin manage lessons" on public.course_lessons
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published batches" on public.batches
  for select using (is_published = true or public.is_admin());
create policy "admin manage batches" on public.batches
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published papers" on public.sample_papers
  for select using (is_published = true or public.is_admin());
create policy "admin manage papers" on public.sample_papers
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published testimonials" on public.testimonials
  for select using (is_published = true or public.is_admin());
create policy "admin manage testimonials" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published reviews" on public.reviews
  for select using (is_published = true or public.is_admin());
create policy "admin manage reviews" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "admin read profiles" on public.profiles
  for select using (public.is_admin());
create policy "admin update profiles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

create policy "users manage own saved papers" on public.saved_sample_papers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "admin read saved papers" on public.saved_sample_papers
  for select using (public.is_admin());

create policy "anyone insert counselling" on public.counselling_requests
  for insert with check (
    status = 'new'
    and (user_id is null or user_id = auth.uid())
  );
create policy "users read own counselling" on public.counselling_requests
  for select using (auth.uid() = user_id or public.is_admin());
create policy "admin manage counselling" on public.counselling_requests
  for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own enrollments" on public.enrollments
  for select using (auth.uid() = user_id or public.is_admin());
create policy "users insert own enrollments" on public.enrollments
  for insert with check (auth.uid() = user_id);
create policy "admin manage enrollments" on public.enrollments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own download logs" on public.download_logs
  for select using (auth.uid() = user_id or public.is_admin());
create policy "users read own view logs" on public.view_logs
  for select using (auth.uid() = user_id or public.is_admin());

create policy "public read settings" on public.site_settings
  for select using (true);
create policy "admin manage settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('sample-papers', 'sample-papers', false)
on conflict (id) do nothing;

create policy "admins upload sample papers"
on storage.objects for insert
with check (bucket_id = 'sample-papers' and public.is_admin());

create policy "admins update sample papers"
on storage.objects for update
using (bucket_id = 'sample-papers' and public.is_admin());

create policy "admins delete sample papers"
on storage.objects for delete
using (bucket_id = 'sample-papers' and public.is_admin());

create policy "admins read sample papers"
on storage.objects for select
using (bucket_id = 'sample-papers' and public.is_admin());

insert into public.site_settings (id) values ('default') on conflict do nothing;
