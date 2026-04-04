# CotoControl — Contexto para Claude Code

## Qué es este proyecto
PWA mobile-first para gestionar una huerta comunitaria de 4 personas (Nacho, Paloma, Carmen, Sergio). Permite ver un mapa SVG interactivo de los bancales, registrar plantaciones, hacer seguimiento del ciclo de vida de cultivos, y mantener un diario de acciones (regar, cosechar, abonar...).

**URL producción**: https://huerta-tracker.vercel.app
**Spec completa**: Lee `/Users/alvaro/Desktop/Huerta Tracker/SPEC.md` para la arquitectura detallada.

## Stack
- **Vite 8 + React 19 + TypeScript 5.9** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (NO hay tailwind.config.js — colores en CSS vars en index.css)
- **Supabase** (PostgreSQL + Realtime) como backend. Cliente en `src/lib/supabase.ts`. Si no hay .env, la app funciona offline con mock data de `src/lib/constants.ts`
- **React Router v7** para routing
- **vite-plugin-pwa** para PWA (service worker, manifest, offline)
- **Vercel** para hosting (env vars configuradas allí)

## Autenticación
NO usa Supabase Auth. Selector de 4 perfiles locales guardado en `localStorage`. Las queries a Supabase usan la `anon` key con RLS policies abiertas para `anon`.

## Estructura clave
```
src/
├── lib/types.ts         ← Interfaces: Bancal, Planting, ActivityLog, Profile
├── lib/constants.ts     ← BANCALES, COMUNEROS, ACTION_TYPES, CROP_STAGES, BANCAL_STATES, mock data
├── lib/supabase.ts      ← Cliente Supabase (null si no hay .env)
├── hooks/               ← useBancales, usePlantings, useActivityLogs, useLastWatered, useAuth
├── pages/               ← MapPage, BancalPage, ActivityPage, SettingsPage
├── components/map/      ← HuertaMap.tsx (SVG 960×750), BancalShape.tsx
├── components/bancal/   ← PlantingForm.tsx, LogActionSheet.tsx
├── components/ui/       ← Toast.tsx
└── components/layout/   ← AppShell.tsx, BottomNav.tsx
```

## Modelo de datos (Supabase)
- **bancales**: 18 bancales con posiciones SVG, dimensiones, estado (planted/available/chickens/waiting_chickens/post_chickens)
- **plantings**: Cultivos con stage 0-4 (germinación→semillas), status (active/harvested/failed/removed)
- **activity_logs**: Acciones con 12 tipos (planted, watered, harvested, fertilized, weeded, pruned, treated, observed, soil_work, chickens_in, chickens_out, other)

## Patrones de los hooks
Todos siguen: estado inicial vacío → fetch Supabase → suscripción realtime (canal con `useId()` único) → cleanup. Fallback a mock si supabase es null o fetch falla.

## Diseño visual
- Dark theme por defecto (--earth-900 fondo)
- Paleta: verde (plantado), naranja (gallinas/barbecho), morado (invernadero), tierra (neutros), water (riego), alert (errores)
- Tipografía: DM Serif Display (headings), IBM Plex Sans (body), IBM Plex Mono (datos)
- Mobile-first target 375px

## Cosas a tener en cuenta
- `.npmrc` tiene `legacy-peer-deps=true` (necesario para vite-plugin-pwa con Vite 8)
- Los bancales B1-B9 están en disposición circular tipo reloj (B1 a las y25, clockwise hasta B9 a las y15, hueco de 120° arriba-derecha)
- Todos los bancales B1-B15 tienen 2 líneas de riego. Excepciones: INV=8, PAT=5, LFR=1
- El mapa SVG lee posiciones del array BANCALES — es la source of truth
- Las acciones de stage, cosecha y cambio de estado crean logs automáticos
- Cuando un bancal se queda sin plantaciones activas, su estado pasa a 'waiting_chickens'
