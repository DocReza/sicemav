create extension if not exists pgcrypto;

create table if not exists public.expedientes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  folio text not null unique,
  solicitante text not null,
  correo text not null,
  telefono text not null,
  contraparte text not null,
  paciente text,
  tipo text not null,
  modalidad text not null,
  hechos text not null,
  facilitador text,
  estado text not null,
  mecanismo text
);

create table if not exists public.actuaciones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expediente_id uuid not null references public.expedientes(id) on delete cascade,
  texto text not null
);

alter table public.expedientes enable row level security;
alter table public.actuaciones enable row level security;

create policy "allow read expedientes" on public.expedientes for select using (true);
create policy "allow insert expedientes" on public.expedientes for insert with check (true);
create policy "allow update expedientes" on public.expedientes for update using (true);

create policy "allow read actuaciones" on public.actuaciones for select using (true);
create policy "allow insert actuaciones" on public.actuaciones for insert with check (true);
