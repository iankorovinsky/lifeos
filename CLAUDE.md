# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Guidelines

- **This is an MVP** - prioritize concise, simple solutions over complex abstractions
- **Use shadcn/ui** for base components (`npx shadcn@latest add <component>`)
- **Build reusable components** when patterns repeat; place in `components/`
- **Define types in `@lifeos/types`** - avoid defining types locally in apps
- **No `any` or `unknown`** - use proper types; infer from Prisma when possible
- **Data is per-user** - all queries should be scoped to the authenticated user
- **Run `bun run ci` after changes** to verify typecheck, lint, format, build, and tests pass

## Build & Development Commands

```bash
# Install dependencies
bun install

# Development (starts web + api with interactive TUI)
bun run dev

# Build all packages
bun run build

# Run all CI checks (typecheck → lint → format:check → build → test)
bun run ci

# Individual checks
bun run typecheck
bun run lint
bun run test
bun run format
```

### Database Commands

```bash
bun run db:generate    # Generate Prisma client (run after schema changes)
bun run db:migrate     # Run migrations
bun run db:studio      # Open Prisma Studio
```

### Running Single App/Package

```bash
bun run --filter '@lifeos/api' dev       # API only
bun run --filter '@lifeos/web' dev       # Web only
bun run --filter '@lifeos/api' test      # API tests only
```

## Architecture

This is a Bun/Turbo monorepo with the following structure:

- **apps/web**: Next.js 16 frontend with React 19, Tailwind CSS 4, shadcn/ui components
- **apps/api**: Express 5 backend API
- **packages/db**: Prisma 6 schema, client, and migrations (PostgreSQL)
- **packages/types**: Shared TypeScript types (`@lifeos/types`)

### Package Dependencies

All workspace packages use the `workspace:*` protocol. Import shared types from `@lifeos/types` and database client from `@lifeos/db`.

### Authentication

Uses Supabase with SSR support:

- Client: `@supabase/supabase-js` via `lib/supabase/client.ts`
- Server: `@supabase/ssr` via `lib/supabase/server.ts`
- Auth context: `AuthProvider` in `lib/auth/auth-context.tsx`
- User sync: `syncUser()` syncs Supabase user to Prisma `User` model

### Shared Types

Types are centralized in `packages/types`:

- `User` - re-exported from Prisma
- `AuthUser` - client-side auth user subset
- `ApiResponse<T>`, `ApiError` - standard API response wrappers
- `Integration`, `IntegrationType` - integration definitions

### API Structure

Express routes follow pattern: `routes/*.ts` → `controllers/*.ts` → `models/*.ts`

Error responses use `ApiResponse<null>` format from `@lifeos/types`.

## Environment Variables

Create `.env` at repo root. Required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection (for Prisma migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
