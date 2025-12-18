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

## Development

- **Entry point**: `app/page.tsx`
- **Database client**: Import from `@lifeos/db` workspace package
- **Environment variables**: Loaded from root `.env` file (see root README)

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

## Workspace Dependencies

This app depends on:

- `@lifeos/db` - Prisma database client and schema
