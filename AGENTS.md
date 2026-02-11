# Repository Guidelines

## Project Structure & Module Organization

- `apps/web/`: Next.js frontend.
- `apps/api/`: Bun + Express API.
- `packages/db/`: Prisma schema and generated client.
- `packages/types/`: Shared TypeScript types; define most shared types here.
- `packages/jobs/`: Trigger.dev background tasks.
- `tools/scripts/`: Repo utilities (e.g., dev TUI).
- Root configs: `package.json`, `turbo.json`, `tsconfig.base.json`.

## Build, Test, and Development Commands

- `bun install`: install workspace dependencies.
- `bun run dev`: launch the dev TUI for web + api.
- `bun run dev:parallel`: run app dev servers via Turborepo.
- `bun run build`: build all packages/apps.
- `bun run typecheck`: typecheck all packages.
- `bun run lint`: run ESLint across the repo.
- `bun run format`: apply Prettier formatting.
- `bun run format:check`: verify formatting only.
- `bun run test`: run tests (Jest in `apps/api`).
- `bun run ci`: local equivalent of CI checks; run after any change to confirm build and checks pass.
- Database: `bun run db:generate`, `bun run db:migrate`, `bun run db:studio`, `bun run db:format`.
- Trigger.dev: `bunx trigger.dev login`, `bun run trigger:dev`, `bun run trigger:deploy`.

## Coding Style & Naming Conventions

- TypeScript is the primary language; follow existing patterns in each app.
- Formatting is enforced by Prettier; run `bun run format` before PRs.
- Linting uses ESLint (Next.js rules in `apps/web`, TS rules in `apps/api`).
- Naming: `PascalCase` for React components, `camelCase` for variables/functions, `kebab-case` for file names when used in UI modules (follow nearby files).
- Use shadcn as the base for UI components and extend it as needed.
- Prioritize reusable components over one-off implementations.
- Avoid `any`, `unknown`, or vague types; prefer precise, shared types.

## Testing Guidelines

- API tests use Jest; place tests alongside code or in `__tests__/` as appropriate.
- Run all tests with `bun run test` before submitting.
- No explicit coverage threshold is configured; keep test scope proportional to changes.

## Commit & Pull Request Guidelines

- Recent history shows short, imperative summaries (e.g., “reorg”, “Updated README”). Keep commit messages concise and action-oriented.
- PRs should include: summary, key changes, and any required screenshots for UI work.
- Link related issues or notes if the change affects product behavior or data.

## Product & Architecture Notes

- The app is segmented per-user; ensure data access and UI behavior respect user boundaries.
- Prefer concise, MVP-focused solutions over overcomplicated designs.
- Trigger.dev tasks live in `packages/jobs/src/` with config in `trigger.config.ts`. Deploys happen on push to `main` and require `TRIGGER_ACCESS_TOKEN`.

## Configuration Notes

- Root `.env` is loaded by Bun and shared by apps. Add app-specific overrides via `.env.local` if needed.
- Trigger.dev requires `TRIGGER_SECRET_KEY` for task execution.
