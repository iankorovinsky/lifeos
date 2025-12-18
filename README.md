# LifeOS Monorepo

## Structure

```
lifeos/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Backend API (Bun)
│
├── packages/
│   └── db/           # Prisma schema & database client
│
├── tools/
│   └── scripts/      # Repo scripts
│
├── package.json       # Root workspace config
├── tsconfig.base.json # Base TypeScript config
└── .eslintignore      # Linter instructions
```

## Setup

```bash
# Install all dependencies
bun install

# Generate Prisma client (must run after schema changes)
bun run db:generate

# Run migrations
bun run db:migrate
```

## Commands

### Root Commands

```bash
# Development
bun run dev                    # Start dev UI (web + api)
bun run dev:parallel          # Start all apps in parallel with turbo

# Build & Test
bun run build                 # Build all packages
bun run typecheck             # Typecheck all packages
bun run lint                  # Lint all packages
bun run test                  # Run tests in all packages
bun run format                # Format all files with prettier
bun run fmt                   # Alias for format
bun run format:check          # Check formatting without modifying files

# Database
bun run db:generate           # Generate Prisma client
bun run db:migrate            # Run database migrations (dev)
bun run db:studio             # Open Prisma Studio
bun run db:format             # Format Prisma schema
```

### API Commands (`apps/api`)

```bash
bun run --filter '@lifeos/api' dev          # Start API dev server
bun run --filter '@lifeos/api' build        # Build API
bun run --filter '@lifeos/api' start        # Start production server
bun run --filter '@lifeos/api' typecheck    # Typecheck API code
bun run --filter '@lifeos/api' lint         # Lint API code
bun run --filter '@lifeos/api' test         # Run API tests
bun run --filter '@lifeos/api' test:watch   # Run tests in watch mode
```

### Web Commands (`apps/web`)

```bash
bun run --filter '@lifeos/web' dev          # Start Next.js dev server
bun run --filter '@lifeos/web' build        # Build Next.js app
bun run --filter '@lifeos/web' start        # Start production server
bun run --filter '@lifeos/web' typecheck    # Typecheck web code
bun run --filter '@lifeos/web' lint         # Lint web code
```

### Database Commands (`packages/db`)

```bash
bun run --filter '@lifeos/db' generate      # Generate Prisma client
bun run --filter '@lifeos/db' migrate:dev    # Run migrations (dev)
bun run --filter '@lifeos/db' migrate:deploy # Deploy migrations (prod)
bun run --filter '@lifeos/db' studio         # Open Prisma Studio
bun run --filter '@lifeos/db' format         # Format Prisma schema
```

## Workspace Packages

### Apps

- `@lifeos/web` - Next.js frontend application
- `@lifeos/api` - Backend API server (Bun runtime)

### Packages

- `@lifeos/db` - Prisma schema and database client

## Environment Variables

Create a `.env` file at the **root** of the monorepo with your environment variables.

Bun automatically loads `.env` from the root, so all workspace packages (web, api, db) will have access to these variables. Individual apps can override with their own `.env.local` files if needed.

## Adding New Packages

1. Create directory in `packages/` or `apps/`
2. Add `package.json` with unique name (e.g., `@lifeos/ui`)
3. Add to dependencies with `workspace:*` protocol
4. Run `bun install`
