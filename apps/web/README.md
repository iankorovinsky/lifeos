# @lifeos/web

Next.js frontend application for LifeOS, part of the LifeOS monorepo.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2
- **Styling**: Tailwind CSS 4
- **TypeScript**: 5.x
- **Database**: Prisma Client via `@lifeos/db` workspace package

## Getting Started

### From Monorepo Root

```bash
# Install all dependencies (if not already done)
bun install

# Generate Prisma client (required before first run)
bun run db:generate

# Run web app (or use `bun run dev` to run web + api)
bun run --filter '@lifeos/web' dev
```

### From This Directory

```bash
# Install dependencies (if not already done)
bun install

# Run development server
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Commands

```bash
# Development
bun dev                    # Start Next.js dev server
bun run dev                # Same as above

# Build & Production
bun build                  # Build for production
bun start                  # Start production server

# Code Quality
bun typecheck              # Typecheck without emitting files
bun lint                   # Run ESLint
```

### Running from Monorepo Root

```bash
# All commands can be run from root with filter
bun run --filter '@lifeos/web' dev          # Start Next.js dev server
bun run --filter '@lifeos/web' build        # Build Next.js app
bun run --filter '@lifeos/web' start        # Start production server
bun run --filter '@lifeos/web' typecheck    # Typecheck web code
bun run --filter '@lifeos/web' lint         # Lint web code
```

## Development

- **Entry point**: `app/page.tsx`
- **Database client**: Import from `@lifeos/db` workspace package
- **Environment variables**: Loaded from root `.env` file (see root README)
- **Port**: 3000 (default Next.js port)

## Workspace Dependencies

This app depends on:

- `@lifeos/db` - Prisma database client and schema
