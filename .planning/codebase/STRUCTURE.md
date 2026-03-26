# Codebase Structure

**Analysis Date:** 2026-03-26

## Directory Layout

```
base-project/
├── apps/                       # Application packages
│   ├── api/                    # Hono backend API
│   │   └── src/
│   │       ├── app.ts          # Main entry point
│   │       ├── db/             # Database schema and initialization
│   │       ├── lib/            # Utilities, types, configuration
│   │       ├── middlewares/    # Cross-cutting middleware
│   │       └── routes/         # API route definitions and handlers
│   └── web/                    # React frontend
│       └── src/
│           ├── components/     # React components
│           ├── lib/            # Client utilities
│           ├── routes/         # File-based routing
│           └── assets/         # Static files
├── packages/                   # Shared packages
│   ├── api-client/             # Generated Hono RPC client
│   └── eslint-config/          # Shared ESLint configuration
├── .planning/                  # GSD planning documents
├── pnpm-workspace.yaml         # Workspace definition
├── package.json                # Root scripts
└── tsconfig.json               # Root TypeScript config
```

## Directory Purposes

**apps/api:**
- Purpose: Backend REST API server
- Contains: Route handlers, database schemas, middleware, utilities
- Key files: `src/app.ts` (entry), `src/routes` (endpoints), `src/db/schema` (ORM models)

**apps/api/src/routes:**
- Purpose: HTTP endpoint definitions organized by resource
- Contains: Route schemas, handlers, subrouters
- Key files: `user/user.routes.ts` (schema), `user/user.handlers.ts` (logic), `user/user.index.ts` (router)

**apps/api/src/db:**
- Purpose: Database schema and connection management
- Contains: Drizzle ORM table definitions, migrations, db initialization function
- Key files: `schema/user.ts` (table definitions), `index.ts` (connection factory)

**apps/api/src/lib:**
- Purpose: API-level utilities and configuration
- Contains: Type definitions, router factory, app factory, constants
- Key files: `types.ts` (AppEnv, AppOpenAPI), `create-router.ts`, `create-app.ts`

**apps/api/src/middlewares:**
- Purpose: Hono middleware for logging and error handling
- Contains: Pino logger setup, context injection
- Key files: `pino-logger.ts`

**apps/web/src/routes:**
- Purpose: File-based routing with TanStack Router
- Contains: Route components organized by URL path
- Key files: `__root.tsx` (root layout), `_authenticated.tsx` (authenticated layout), `_authenticated/dashboard.tsx` (page)

**apps/web/src/components:**
- Purpose: Reusable React components
- Contains: UI components (Radix UI + TailwindCSS), example components
- Key files: `ui/*` (component library), `component-example.tsx` (template)

**apps/web/src/lib:**
- Purpose: Client-side utilities and configuration
- Contains: React Query setup, utility functions
- Key files: `query-client.ts` (React Query configuration), `utils.ts`

**packages/api-client:**
- Purpose: Type-safe Hono RPC client for API consumption
- Contains: Client factory that infers types from server router
- Key files: `src/index.ts` (client factory and error types)

**packages/eslint-config:**
- Purpose: Shared ESLint configuration
- Contains: Base eslint rules used across workspace

## Key File Locations

**Entry Points:**
- API: `apps/api/src/app.ts` - Hono app initialization, route registration, OpenAPI config
- Web: `apps/web/src/main.tsx` - React root render, React Router setup

**Configuration:**
- Workspace: `pnpm-workspace.yaml` - Package paths
- Root Scripts: `package.json` - Workspace-level commands (dev, build, test, lint, deploy)
- TypeScript: `tsconfig.json` - Root config extended by apps
- API TypeScript: `apps/api/tsconfig.json` - Hono-specific path aliases and types
- Web TypeScript: `apps/web/tsconfig.json` - React-specific configuration

**Core Logic:**
- User API: `apps/api/src/routes/user/` - User list endpoint
- User Schema: `apps/api/src/db/schema/user.ts` - User table definition
- Authentication Layouts: `apps/web/src/routes/_authenticated.tsx` - Dashboard layout wrapper
- Authentication Pages: `apps/web/src/routes/login.tsx`, `apps/web/src/routes/signup.tsx`

**Testing:**
- API Tests: `apps/api/src/routes/user/user.test.ts` - Vitest API endpoint tests

## Naming Conventions

**Files:**
- Handlers: `{resource}.handlers.ts` (e.g., `user.handlers.ts`)
- Routes: `{resource}.routes.ts` (e.g., `user.routes.ts`)
- Index routers: `{resource}.index.ts` (e.g., `user.index.ts`)
- Tests: `{name}.test.ts` or `{name}.spec.ts`
- Components: PascalCase (e.g., `AlertDialog.tsx`)
- Utilities: camelCase (e.g., `query-client.ts`)
- Schemas: PascalCase for tables (e.g., `users` table), camelCase for files (e.g., `user.ts`)

**Directories:**
- Resource-based: Singular resource name (e.g., `user/` for users endpoint)
- Layout groups: Leading underscore for grouping (e.g., `_authenticated/`)
- UI Components: Lowercase kebab-case (e.g., `ui/alert-dialog.tsx`)
- Shared: `lib/` for utilities, `components/` for UI, `assets/` for static

## Where to Add New Code

**New API Endpoint:**
- Primary code: Create `apps/api/src/routes/{resource}/` directory with:
  - `{resource}.routes.ts` - Define route with Zod schema using `createRoute`
  - `{resource}.handlers.ts` - Implement handler function with AppRouteHandler type
  - `{resource}.index.ts` - Create router and attach routes
- Register in: `apps/api/src/routes/index.ts` via `.route("/resource", resourceRouter)`
- Schema: Define in `apps/api/src/db/schema/{resource}.ts` if querying database

**New Frontend Page:**
- Create file: `apps/web/src/routes/{path}.tsx`
- Implement: Default export with `createFileRoute("/path")({ component: ComponentName })`
- Styling: Use TailwindCSS classes and Radix UI components from `apps/web/src/components/ui/`

**New UI Component:**
- Create: `apps/web/src/components/ui/{component-name}.tsx`
- Pattern: Radix UI + TailwindCSS, typed props, optional class-variance-authority for variants
- Import: From `@base-project/web/components/ui/{component-name}` in pages

**New Shared Utility:**
- API Utility: `apps/api/src/lib/{utility-name}.ts`
- Web Utility: `apps/web/src/lib/{utility-name}.ts`
- Shared Library: `packages/{package-name}/src/` for cross-workspace usage

**New Authenticated Route:**
- Create under: `apps/web/src/routes/_authenticated/{path}.tsx`
- Automatically inherits: DashboardLayout from `_authenticated.tsx`
- Register: No registration needed (file-based routing)

## Special Directories

**apps/api/src/db/migrations:**
- Purpose: Database migration files
- Generated: Yes (via `drizzle-kit generate`)
- Committed: Yes
- Management: Run `npm run db:generate`, then `npm run db:migrate:local` or `db:migrate:remote`

**apps/api/src/db/migrations/meta:**
- Purpose: Migration metadata tracked by Drizzle Kit
- Generated: Yes (automatic)
- Committed: Yes
- Management: Do not manually edit

**apps/web/src/routes/routeTree.gen.ts:**
- Purpose: Generated route tree for TanStack Router type safety
- Generated: Yes (via @tanstack/router-plugin)
- Committed: No (gitignored)
- Management: Auto-generated on build, regenerated on route file changes

**apps/api/dist / apps/web/dist:**
- Purpose: Build output directories
- Generated: Yes (via build scripts)
- Committed: No (gitignored)
- Management: Created by `pnpm build`

**node_modules / .pnpm:**
- Purpose: Installed dependencies
- Generated: Yes (via pnpm)
- Committed: No (gitignored)
- Management: Run `pnpm install`

---

*Structure analysis: 2026-03-26*
