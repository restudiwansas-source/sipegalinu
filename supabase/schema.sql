create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  kode_blok text unique not null,
  nama_blok text not null,
  interactive_map text,
  offline_pdf text,
  jumlah_objek integer,
  luas text,
  lat double precision,
  lng double precision,
  color text default '#2d5a3d',
  created_at timestamp with time zone default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  app_name text default 'SiPegaLinu',
  subtitle text default 'Sistem Peta Digital Lintas User',
  footer_text text default '© 2026 SiPegaLinu',
  logo_url text,
  favicon_url text,
  header_color text default '#1a3a2a',
  sidebar_color text default '#0f2419',
  background_color text default '#f5f0e8',
  accent_color text default '#c9a84c',
  layout_mode text default 'mobile_tabs',
  updated_at timestamp with time zone default now()
);

create table if not exists menus (
  id text primary key,
  label text not null,
  icon text default '🏠',
  enabled boolean default true,
  order_no integer default 10,
  allowed_roles text[] default array['admin']
);

create table if not exists roles (
  id text primary key,
  label text not null,
  can_upload boolean default false,
  can_branding boolean default false,
  can_manage_users boolean default false,
  can_manage_roles boolean default false,
  can_view_all_data boolean default false
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null,
  name text not null,
  role_key text references roles(id),
  avatar text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

alter table blocks disable row level security;
alter table settings disable row level security;
alter table menus disable row level security;
alter table roles disable row level security;
alter table app_users disable row level security;

insert into roles (id,label,can_upload,can_branding,can_manage_users,can_manage_roles,can_view_all_data) values
('admin','Admin',true,true,true,true,true),
('petugas','Petugas',false,false,false,false,true),
('kades','Kades',false,false,false,false,true),
('wajibpajak','Wajib Pajak',false,false,false,false,false)
on conflict (id) do nothing;

insert into app_users (username,password,name,role_key,avatar,active) values
('admin','admin123','Administrator','admin','A',true),
('petugas','petugas123','Petugas Lapangan','petugas','P',true),
('kades','kades123','Kepala Desa','kades','K',true),
('wajibpajak','wp123','Wajib Pajak','wajibpajak','W',true)
on conflict (username) do nothing;

insert into menus (id,label,icon,enabled,order_no,allowed_roles) values
('beranda','BERANDA','🏠',true,1,array['admin','petugas','kades','wajibpajak']),
('peta','PETA','🗺️',true,2,array['admin','petugas','kades','wajibpajak']),
('pdf','PETA BLOK','📄',true,3,array['admin','petugas','kades','wajibpajak']),
('data','DATA','📊',true,4,array['admin','petugas','kades']),
('profil','PROFIL','👤',true,5,array['admin','petugas','kades','wajibpajak'])
on conflict (id) do nothing;

insert into blocks (kode_blok,nama_blok,jumlah_objek,luas,lat,lng,color) values
('001','Blok 001 Sukapancar',117,'±5 Ha',-7.1327,108.1730,'#2d5a3d')
on conflict (kode_blok) do nothing;
