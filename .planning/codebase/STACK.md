# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- TypeScript ~5.9.3 - Used across all packages and applications
- JavaScript (ESNext) - Node.js modules, configuration files

**Secondary:**
- SQL (SQLite) - Database schema and migrations

## Runtime

**Environment:**
- Node.js - Inferred from package.json structure and TypeScript compilation targets
- Cloudflare Workers - Primary deployment runtime via Wrangler
- Web Browser (ES2020+) - React SPA frontend

**Package Manager:**
- pnpm 10.5.2 - Monorepo package manager with workspace support
- Lockfile: present (pnpm-lock.yaml)

## Frameworks

**Core:**
- Hono 4.10.4 - Backend API framework, used in both `apps/api` and `packages/api-client`
- React 19.2.0 - Frontend UI framework
- TanStack Router 1.150.0 - File-based routing for React SPA

**API & Data:**
- Drizzle ORM 0.44.7 - Type-safe database ORM for SQLite
- Drizzle-Kit 0.31.6 - Migration and schema generation tool
- Zod 4.1.12 - Runtime schema validation and TypeScript inference

**HTTP & API Documentation:**
- @hono/zod-openapi 1.1.4 - OpenAPI 3.0 schema generation for Hono routes
- @scalar/hono-api-reference 0.9.24 - Interactive API documentation UI
- stoker 2.0.1 - OpenAPI utilities for Hono

**UI & Components:**
- Tailwind CSS 4.1.17 - Utility-first CSS framework via Vite plugin
- Radix UI (assorted) - Headless UI component library
  - @radix-ui/react-avatar 1.1.11
  - @radix-ui/react-switch 1.2.6
- Shadcn - Pre-built component system
- class-variance-authority 0.7.1 - Component variant pattern utility
- lucide-react 0.562.0 - Icon library

**State Management & Data Fetching:**
- TanStack React Query 5.90.18 - Client-side data fetching and caching
- TanStack React Query DevTools 5.91.2 - Query debugging utilities

**Drag & Drop:**
- @dnd-kit/core 6.3.1 - Headless drag-and-drop library
- @dnd-kit/sortable 10.0.0 - Sortable preset for dnd-kit
- @dnd-kit/utilities 3.2.2 - Utility functions for dnd-kit

**Logging:**
- Pino 10.1.0 - Structured logging framework
- hono-pino 0.10.3 - Pino integration middleware for Hono
- pino-pretty 13.1.2 - Pretty-print Pino logs in development

**Testing:**
- Vitest 3.2.4 - Unit test runner
- @cloudflare/vitest-pool-workers 0.10.5 - Cloudflare Workers test environment

**Build/Dev:**
- Vite 7.2.4 - Frontend bundler and dev server
- @vitejs/plugin-react 5.1.1 - React plugin for Vite
- @tailwindcss/vite 4.1.17 - Tailwind CSS Vite plugin
- @tanstack/router-plugin 1.150.0 - TanStack Router code generation plugin
- Wrangler 4.54.0 - Cloudflare Workers CLI and build tool

**Linting & Code Quality:**
- ESLint 9.39.1 - JavaScript linter
- typescript-eslint 8.46.4 - TypeScript ESLint plugin
- eslint-plugin-drizzle 0.2.3 - Drizzle ORM best practices linting
- eslint-plugin-react-hooks 7.0.1 - React hooks rules
- eslint-plugin-react-refresh 0.4.24 - React refresh rules
- eslint-plugin-format 1.0.2 - Code formatting enforcement

**Utilities:**
- tsx 4.20.6 - TypeScript execution without compilation
- cross-env 10.1.0 - Cross-platform environment variable setting
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.4.0 - Tailwind CSS class merging
- tw-animate-css 1.4.0 - Animation utilities
- dotenv 17.2.3 - Environment variable loading
- @fontsource-variable/public-sans 5.2.7 - Variable font loading

## Configuration

**Environment:**
- Configuration via Wrangler bindings (Cloudflare Workers environment variables)
- Runtime environment variables accessible via `c.env` in Hono context
- Key bindings:
  - `DB` - Cloudflare D1 database binding
  - `ASSETS` - Static asset serving binding
  - `AUTH_SECRET` - Authentication secret
  - `LOG_LEVEL` - Logging level configuration
  - `NODE_ENV` - Environment mode (development/production)

**Build:**
- Wrangler configuration: `apps/api/wrangler.jsonc`
- Drizzle configuration: `apps/api/drizzle.config.ts`
- TypeScript configuration: `tsconfig.json` (root, apps/api, apps/web, packages/api-client)
- Vite configuration: `apps/web/vite.config.ts`
- Vitest configuration: `apps/api/vitest.config.ts`

## Monorepo Structure

**Package Manager:** pnpm with workspace support

**Workspaces:**
- `apps/api` - Hono backend API running on Cloudflare Workers
- `apps/web` - React SPA frontend with Vite
- `packages/api-client` - Type-safe RPC client for API
- `packages/eslint-config` - Shared ESLint configuration

## Platform Requirements

**Development:**
- Node.js with pnpm package manager
- TypeScript compiler (tsc)
- Wrangler CLI for local development

**Production:**
- Cloudflare Workers platform for backend API
- Static hosting for frontend SPA (ASSETS binding on Cloudflare Workers)
- Cloudflare D1 SQLite database

---

*Stack analysis: 2026-03-26*
