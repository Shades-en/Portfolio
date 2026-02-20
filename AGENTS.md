# AGENTS.md (Portfolio Repository)

## Scope And Precedence
- These instructions apply to this repository by default.
- Direct system/developer/user chat instructions override this file.
- If nested `AGENTS.md` or `AGENTS.override.md` files are added later, the file closest to the edited code takes precedence.

## Project Snapshot
- Stack: Next.js 15 App Router, React 18, TypeScript, Tailwind CSS, Radix UI.
- State/data: Redux Toolkit + redux-saga, TanStack Query, JSON-backed portfolio content.
- Key directories:
  - `src/app`: routes, layout, API routes.
  - `src/components`: feature sections and reusable UI.
  - `src/store`: Redux store, slices, sagas.
  - `src/lib`: API clients, actions, utilities.
  - `src/data`: static content.

## Package Manager And Commands
- Prefer `yarn` for all JavaScript/TypeScript workflows in this repo.
- Install dependencies: `yarn install`
- Start development server: `yarn dev`
- Production build: `yarn build`
- Start production server: `yarn start`
- Lint: `yarn lint`
- Type check: `yarn type-check`
- Preferred validation after edits: `yarn lint && yarn type-check`

## Environment And Secrets
- Use `.env.local.example` as the source template and create `.env.local`.
- Never commit secrets or real API keys.
- When adding a new environment variable:
  - Add it to `.env.local.example` with an empty or placeholder value.
  - Document expected usage near the consuming code when not obvious.

## TypeScript And React Standards
- Keep `strict` TypeScript compatibility; avoid `any` unless there is a clear, documented reason.
- Add explicit types for exported functions, component props, reducers, and API contracts.
- Reuse existing shared types from `src/types` before creating new ones.
- Prefer small, single-purpose components and helpers over large mixed-responsibility files.
- Use guard clauses/early returns to avoid deep nesting.
- Avoid mutable shared state outside approved store/context patterns.

## Next.js Rules
- Follow App Router conventions in `src/app`.
- Default to Server Components; add `"use client"` only when browser APIs, client state, or hooks are required.
- Keep server-only logic in server contexts (`src/lib/actions`, API routes, or server components).
- Do not relax build safety settings in `next.config.js` (`typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` must remain `false`).
- Respect existing image/transpile/optimization settings in `next.config.js` unless a task explicitly requires changing them.

## Data, API, And State Patterns
- Follow existing Redux slice/saga conventions under `src/store`.
- Keep API route behavior consistent with patterns in `src/app/api/chat/**`.
- Validate external or user-provided payloads with existing schema/type patterns (e.g., `zod` where appropriate).
- Prefer existing utilities in `src/lib` and `src/utils` over duplicating logic.

## UI And Design System (Repo-Specific)
- Use `.windsurf/rules/portfolio-design-rules.md` as the design source of truth for portfolio visuals.
- Preserve the established dark cyberpunk aesthetic for new UI work.
- Keep colors and design tokens in HSL and prefer CSS variables defined in `src/app/globals.css`.
- Reuse existing utility classes and patterns:
  - `glass-card` for glassmorphism card surfaces.
  - Gradient/neon classes such as `gradient-text` and glow/text-shadow effects where appropriate.
- Maintain accessibility and responsive behavior across mobile and desktop.
- Avoid introducing a conflicting visual language unless explicitly requested.

## Coding Conventions
- Use English for code and documentation.
- Naming:
  - `PascalCase` for React component files and types/interfaces.
  - `camelCase` for variables/functions.
  - `UPPER_SNAKE_CASE` for environment variables.
- Prefer named exports for components and reusable modules.
- Avoid hardcoded reusable literals; centralize constants when they are reused.

## Change Safety
- Keep changes focused and minimal for the requested task.
- Do not refactor unrelated areas opportunistically.
- Preserve backward compatibility for routes, data formats, and component contracts unless explicitly requested.
- Update nearby documentation/comments when behavior changes materially.

## Validation Before Finishing
- Minimum checks after code changes:
  - `yarn lint`
  - `yarn type-check`
- For release-sensitive or broad changes, also run:
  - `yarn build`
- If a check cannot be run, clearly state that and why.

## Git And PR Hygiene
- Stage only files relevant to the requested task.
- Do not commit secrets, generated artifacts, or unrelated changes.
- Use concise imperative commit messages when commits are requested.
