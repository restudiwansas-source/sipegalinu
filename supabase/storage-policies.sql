create policy "maps public read" on storage.objects for select to anon, authenticated using (bucket_id = 'maps');
create policy "maps public upload" on storage.objects for insert to anon, authenticated with check (bucket_id = 'maps');
create policy "maps public update" on storage.objects for update to anon, authenticated using (bucket_id = 'maps') with check (bucket_id = 'maps');

create policy "pdfs public read" on storage.objects for select to anon, authenticated using (bucket_id = 'pdfs');
create policy "pdfs public upload" on storage.objects for insert to anon, authenticated with check (bucket_id = 'pdfs');
create policy "pdfs public update" on storage.objects for update to anon, authenticated using (bucket_id = 'pdfs') with check (bucket_id = 'pdfs');

create policy "logos public read" on storage.objects for select to anon, authenticated using (bucket_id = 'logos');
create policy "logos public upload" on storage.objects for insert to anon, authenticated with check (bucket_id = 'logos');
create policy "logos public update" on storage.objects for update to anon, authenticated using (bucket_id = 'logos') with check (bucket_id = 'logos');
