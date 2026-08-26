-- Counselling contact details and protection against accidental repeat submissions.
alter table public.counselling_requests
  add column if not exists email text;

create or replace function public.prevent_duplicate_counselling_request()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Serialise requests per phone number so simultaneous submits cannot bypass the check.
  perform pg_advisory_xact_lock(hashtext(new.phone));

  if exists (
    select 1
    from public.counselling_requests
    where phone = new.phone
      and created_at > now() - interval '15 minutes'
  ) then
    raise exception 'duplicate counselling request for this phone number';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_duplicate_counselling_request on public.counselling_requests;
create trigger trg_prevent_duplicate_counselling_request
before insert on public.counselling_requests
for each row execute function public.prevent_duplicate_counselling_request();

create index if not exists idx_counselling_phone_created_at
  on public.counselling_requests (phone, created_at desc);
