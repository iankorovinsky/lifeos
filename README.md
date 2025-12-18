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
├── tooling/
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

# Start development (web + api)
bun run dev

# Or run individually:
bun run --filter './apps/web' dev
bun run --filter './apps/api' dev
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
