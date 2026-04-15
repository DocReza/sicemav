# SICEMAV real · Next.js + Supabase

Este proyecto es una base real para publicar SICEMAV en internet.

## 1. Crear proyecto en Supabase
1. Crea un proyecto nuevo.
2. Ve a SQL Editor.
3. Ejecuta el archivo `supabase-schema.sql`.
4. Copia `Project URL` y `anon public key`.

## 2. Configurar variables
1. Copia `.env.example` a `.env.local`.
2. Pega tus claves:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3. Instalar dependencias
```bash
npm install
```

## 4. Ejecutar local
```bash
npm run dev
```

## 5. Publicar en Vercel
1. Sube este proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Configura las variables de entorno.
4. Deploy.

## Qué incluye esta base
- dashboard
- alta de solicitudes
- consulta de expedientes
- persistencia real en Supabase

## Siguiente fase recomendada
- autenticación real por roles
- vista detallada de expediente
- documentos PDF
- almacenamiento de archivos
- notificaciones
- bitácora automática de actuaciones
