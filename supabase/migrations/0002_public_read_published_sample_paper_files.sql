-- Public visitors receive short-lived signed URLs only for files attached to published papers.
create policy "public read published sample paper files"
on storage.objects for select
using (
  bucket_id = 'sample-papers'
  and exists (
    select 1
    from public.sample_papers
    where is_published = true
      and (file_path = name or solution_file_path = name)
  )
);
