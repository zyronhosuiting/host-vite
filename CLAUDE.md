# CLAUDE.md – Host Living Development Rules

## Stack
- React 18 + TypeScript (`strict: true`)
- Tailwind CSS v3 (custom tokens in `tailwind.config.ts`)
- Vite 5 (dev: `npm run dev` → `http://localhost:5173`)
- React Router v6 (BrowserRouter)
- react-leaflet v4 + Leaflet 1.9

## File Structure
```
src/
├── components/   # UI components — one per file, PascalCase (.tsx)
├── pages/        # Route-level pages — one per route (.tsx)
├── hooks/        # Custom hooks — camelCase, "use" prefix (.ts)
├── data/         # Static data: listings.ts, detailExtras.ts
├── types/        # All TypeScript interfaces in index.ts
├── main.tsx      # App entry point
├── App.tsx       # Router + Routes only
└── index.css     # Leaflet import first, then Tailwind directives, then map/card CSS
```

## Component Rules
- One component per file, filename = ComponentName.tsx
- Max ~100 lines per component — extract sub-components when exceeded
- Props typed as `interface ComponentNameProps { … }`
- Use plain function declarations: `function MyComp(props: Props)` — never `React.FC`
- No `any` — use proper types from `src/types/index.ts`
- No inline styles — use Tailwind; exception: dynamic `color` prop on gradient cards

## TypeScript Conventions
- `strict: true` — no implicit any, no `!` unless truly unavoidable
- Types/interfaces live in `src/types/index.ts`
- `interface` for object shapes, `type` for unions/aliases
- Event handlers fully typed: `React.ChangeEvent<HTMLInputElement>` etc.

## Tailwind Conventions
- Use custom tokens: `text-slate`, `bg-lime`, `text-t3`, `bg-off-white`
- Never use Tailwind's built-in `slate`/`gray` — use custom `slate` (#111827)
- Responsive: `sm:` 640 → `md:` 768 → `lg:` 1024 → `xl:` 1280
- Keep full class names in JSX — avoid computed/split strings that hide classes

## Leaflet Rules
- `@import 'leaflet/dist/leaflet.css'` must be the FIRST line in `src/index.css`
- `.map-marker` and Leaflet popup styles stay in `src/index.css` (not Tailwind)
- Call `map.invalidateSize()` inside `useMap()` + `useEffect` — never via `window`

## Hooks Conventions
- One hook per file in `src/hooks/`
- `useFavorites` — favorites state (localStorage-backed)
- `useFilter` — category + filter logic
- `useMapToggle` — map visibility state
- `useScrollShadow` — header scroll shadow

## Routing
- `BrowserRouter` only — never HashRouter
- Navigate with `<Link>` or `useNavigate()` — never `window.location.href`
- Dynamic params: `/property/:id` → `useParams<{ id: string }>()`
- Active links: use `<NavLink>` with `className` callback

## Before Writing Code
1. Identify components needed
2. Check `src/types/index.ts` for existing types
3. Determine if logic belongs in a hook
4. Create file with TypeScript interface first

## When Refactoring
- One component at a time
- Run `npm run build` after each file to catch type errors
- Never rewrite multiple files simultaneously
