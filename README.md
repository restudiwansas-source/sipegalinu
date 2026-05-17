# SiPegaLinu V4 Foundation Plus

Versi ini melengkapi pondasi Admin Center:
- Branding Manager
- Theme & Layout Manager
- Menu Manager
- Role Manager
- User Manager
- Block Manager
- Upload HTML + PDF per blok
- Supabase-ready

## Jalankan
```bash
npm install
npm run dev
```

Buka:
```txt
http://localhost:5173
```

## Login Demo
```txt
admin / admin123
petugas / petugas123
kades / kades123
wajibpajak / wp123
```

## Setup Supabase
1. Buat project Supabase.
2. Project Settings → API.
3. Ambil Project URL dan Publishable/Anon key.
4. Buat file `.env`:

```env
VITE_SUPABASE_URL=https://PROJECT_ANDA.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

Jangan gunakan secret key.

## Database
Jalankan:
```txt
supabase/schema.sql
```

## Storage
Buat bucket public:
```txt
maps
pdfs
logos
```

Jika upload terkena RLS, jalankan:
```txt
supabase/storage-policies.sql
```

## Catatan Keamanan
Password demo masih tersimpan di table/app untuk pondasi awal. Untuk production, tahap berikutnya harus migrasi ke Supabase Auth.
