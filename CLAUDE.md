<!-- GSD:project-start source:PROJECT.md -->
## Project

**Randomizer Toolkit**

A fun, animated web app with three randomizer tools in a tabbed interface: a spinning wheel where users enter custom items (removed on hit, manual reset), a configurable dice roller (1-6 dice), and a multi-coin flipper. Each tab keeps a history of past results. Built on an existing Hono + React monorepo.

**Core Value:** Satisfying, animated randomization that feels fun to use — the wheel spins smoothly, dice tumble, coins flip with personality.

### Constraints

- **Tech stack**: Must use existing React + Tailwind + Shadcn setup — no new UI frameworks
- **Client-side only**: All randomization logic runs in the browser, no API calls
- **Animations**: Must feel smooth and fun — CSS/JS animations, not GIF/video
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript ~5.9.3 - Used across all packages and applications
- JavaScript (ESNext) - Node.js modules, configuration files
- SQL (SQLite) - Database schema and migrations
## Runtime
- Node.js - Inferred from package.json structure and TypeScript compilation targets
- Cloudflare Workers - Primary deployment runtime via Wrangler
- Web Browser (ES2020+) - React SPA frontend
- pnpm 10.5.2 - Monorepo package manager with workspace support
- Lockfile: present (pnpm-lock.yaml)
## Frameworks
- Hono 4.10.4 - Backend API framework, used in both `apps/api` and `packages/api-client`
- React 19.2.0 - Frontend UI framework
- TanStack Router 1.150.0 - File-based routing for React SPA
- Drizzle ORM 0.44.7 - Type-safe database ORM for SQLite
- Drizzle-Kit 0.31.6 - Migration and schema generation tool
- Zod 4.1.12 - Runtime schema validation and TypeScript inference
- @hono/zod-openapi 1.1.4 - OpenAPI 3.0 schema generation for Hono routes
- @scalar/hono-api-reference 0.9.24 - Interactive API documentation UI
- stoker 2.0.1 - OpenAPI utilities for Hono
- Tailwind CSS 4.1.17 - Utility-first CSS framework via Vite plugin
- Radix UI (assorted) - Headless UI component library
- Shadcn - Pre-built component system
- class-variance-authority 0.7.1 - Component variant pattern utility
- lucide-react 0.562.0 - Icon library
- TanStack React Query 5.90.18 - Client-side data fetching and caching
- TanStack React Query DevTools 5.91.2 - Query debugging utilities
- @dnd-kit/core 6.3.1 - Headless drag-and-drop library
- @dnd-kit/sortable 10.0.0 - Sortable preset for dnd-kit
- @dnd-kit/utilities 3.2.2 - Utility functions for dnd-kit
- Pino 10.1.0 - Structured logging framework
- hono-pino 0.10.3 - Pino integration middleware for Hono
- pino-pretty 13.1.2 - Pretty-print Pino logs in development
- Vitest 3.2.4 - Unit test runner
- @cloudflare/vitest-pool-workers 0.10.5 - Cloudflare Workers test environment
- Vite 7.2.4 - Frontend bundler and dev server
- @vitejs/plugin-react 5.1.1 - React plugin for Vite
- @tailwindcss/vite 4.1.17 - Tailwind CSS Vite plugin
- @tanstack/router-plugin 1.150.0 - TanStack Router code generation plugin
- Wrangler 4.54.0 - Cloudflare Workers CLI and build tool
- ESLint 9.39.1 - JavaScript linter
- typescript-eslint 8.46.4 - TypeScript ESLint plugin
- eslint-plugin-drizzle 0.2.3 - Drizzle ORM best practices linting
- eslint-plugin-react-hooks 7.0.1 - React hooks rules
- eslint-plugin-react-refresh 0.4.24 - React refresh rules
- eslint-plugin-format 1.0.2 - Code formatting enforcement
- tsx 4.20.6 - TypeScript execution without compilation
- cross-env 10.1.0 - Cross-platform environment variable setting
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.4.0 - Tailwind CSS class merging
- tw-animate-css 1.4.0 - Animation utilities
- dotenv 17.2.3 - Environment variable loading
- @fontsource-variable/public-sans 5.2.7 - Variable font loading
## Configuration
- Configuration via Wrangler bindings (Cloudflare Workers environment variables)
- Runtime environment variables accessible via `c.env` in Hono context
- Key bindings:
- Wrangler configuration: `apps/api/wrangler.jsonc`
- Drizzle configuration: `apps/api/drizzle.config.ts`
- TypeScript configuration: `tsconfig.json` (root, apps/api, apps/web, packages/api-client)
- Vite configuration: `apps/web/vite.config.ts`
- Vitest configuration: `apps/api/vitest.config.ts`
## Monorepo Structure
- `apps/api` - Hono backend API running on Cloudflare Workers
- `apps/web` - React SPA frontend with Vite
- `packages/api-client` - Type-safe RPC client for API
- `packages/eslint-config` - Shared ESLint configuration
## Platform Requirements
- Node.js with pnpm package manager
- TypeScript compiler (tsc)
- Wrangler CLI for local development
- Cloudflare Workers platform for backend API
- Static hosting for frontend SPA (ASSETS binding on Cloudflare Workers)
- Cloudflare D1 SQLite database
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- kebab-case for all filenames (enforced by `unicorn/filename-case` ESLint rule)
- Component files: `component-name.tsx` (e.g., `example.tsx`, `alert-dialog.tsx`)
- Handler files: `entity.handlers.ts` (e.g., `user.handlers.ts`)
- Route files: `entity.routes.ts` (e.g., `user.routes.ts`)
- Index files: `entity.index.ts` (e.g., `user.index.ts`)
- Test files: `entity.test.ts` (co-located with implementation)
- camelCase for all function names
- Handler functions use descriptive action verbs: `listUsers`, `createUser`, `updateUser`
- Factory/creation functions prefixed with `create`: `createApp()`, `createRouter()`, `createDb()`
- Middleware functions as noun factories: `pinoLogger()` returns middleware handler
- camelCase for all variable declarations
- Constants in UPPER_SNAKE_CASE: `BASE_PATH`, `ZOD_ERROR_MESSAGES`
- Type variables in camelCase: `dbUsers`, `testEnv`, `assetResponse`
- PascalCase for all type definitions: `AppEnv`, `AppOpenAPI`, `AppRouteHandler`, `ListUsersRoute`
- Type names should be descriptive and specific to use case: `ListUsersRoute` not just `UserRoute`
- Type files: `types.ts` (centralized in lib directories)
## Code Style
- Indentation: 2 spaces (configured in eslint-config)
- Semicolons: required (enforced by ESLint rule `semi: true`)
- Quotes: double quotes only (configured in eslint-config)
- Tool: ESLint 9.39.1 with @antfu/eslint-config v6.2.0
- Config location: `packages/eslint-config/create-config.js`
- Key configuration:
- Custom rules:
## Import Organization
- `@/api` → `./src` (in API app, configured in vitest.config.ts)
- `@base-project/web` → used in web app for imports from shared components/lib
- `@base-project/api` → used for shared route types and exports
- `@base-project/api-client` → used for client types
## Error Handling
- HTTP errors return appropriate status codes via Hono's `c.json()` with message objects
- 404 errors: return `{ message: "Resource not found" }` with `NOT_FOUND` status code
- Database errors: handled by Stoker's `onError` middleware which catches and formats them
- Validation errors: Zod parsing errors are caught and formatted by OpenAPI middleware
- No custom error classes in codebase; rely on middleware error handling
- Error schemas defined using Stoker utilities: `createMessageObjectSchema()`
## Logging
- Access logger via `c.var.logger` in route handlers
- Configure in `middlewares/pino-logger.ts`
- Request ID captured from Cloudflare headers (`cf-ray`) or `x-request-id`, fallback to random UUID
- Log level set via `LOG_LEVEL` environment binding (defaults to "info")
- Browser-friendly output configured (no Node.js transports)
## Comments
- Comments are minimal; code structure and naming should be self-documenting
- Explain WHY decisions were made, not WHAT the code does
- Complex business logic that isn't obvious from variable/function names
- Used sparingly for exported functions and types
- Type annotations serve as inline documentation
- No strict requirement for JSDoc on all functions
## Function Design
- Route handlers are 5-20 lines typically
- Handlers delegate to db/utils for business logic
- Use destructuring for objects
- Type context object as `c` from Hono
- Leverage Hono's middleware context pattern for dependencies
- Route handlers return Hono response objects (`c.json()`, `c.text()`)
- Handlers use Stoker's HTTP status code utilities (`HttpStatusCodes.OK`, `HttpStatusCodes.NOT_FOUND`)
## Module Design
- Named exports for most code
- Default exports only for factory functions and app/router creators
- Explicit export lists in index files for re-export control
- Used for re-exporting from index files
- `src/routes/index.ts` re-exports route definitions
- `src/db/schema/index.ts` re-exports schema exports
- All app-level types in `lib/types.ts`
- Domain-specific types co-located with domain (e.g., `user.routes.ts` exports `ListUsersRoute`)
- Schema types auto-generated from Drizzle ORM via `createSelectSchema()`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Modular pnpm workspace with three distinct packages
- Type-safe API contracts via Hono RPC and Zod schemas
- Server-driven routing in API, file-based routing in frontend
- OpenAPI-first API design with Scalar documentation
- Cloudflare Workers deployment for API, Vite build for frontend
## Layers
- Purpose: HTTP request handling, routing, and validation
- Location: `apps/api/src/routes`
- Contains: Route definitions, handlers, request/response schemas
- Depends on: Database layer, middleware layer, external libraries
- Used by: Web app, API client package
- Purpose: Core application logic, handlers
- Location: `apps/api/src/routes/*/handlers`
- Contains: Handler functions implementing route behavior
- Depends on: Database layer, types, schemas
- Used by: Route definitions
- Purpose: Database connection and schema management
- Location: `apps/api/src/db`
- Contains: Schema definitions (Drizzle ORM), migrations, database initialization
- Depends on: Drizzle ORM, Cloudflare D1
- Used by: Business logic handlers
- Purpose: Cross-cutting concerns
- Location: `apps/api/src/middlewares`
- Contains: Logging (Pino), error handling, request context
- Depends on: Hono, Pino
- Used by: App initialization
- Purpose: User interface rendering
- Location: `apps/web/src/components`
- Contains: React components, UI component library, page layouts
- Depends on: React, Radix UI, Lucide icons, TailwindCSS
- Used by: Route components
- Purpose: File-based routing and navigation
- Location: `apps/web/src/routes`
- Contains: TanStack Router route files, layout components
- Depends on: TanStack Router, presentation layer
- Used by: Main entry point
- Purpose: Server state and client state management
- Location: `apps/web/src/lib`
- Contains: React Query configuration, utilities
- Depends on: React Query, TanStack Router
- Used by: Route components
- Purpose: Type-safe API client generation
- Location: `packages/api-client/src`
- Contains: Hono RPC client factory
- Depends on: Hono client, API router type
- Used by: Web frontend for API calls
## Data Flow
- API: Request-scoped state via Hono context variables (`c.var`)
- Frontend: Server state via React Query, client state via React hooks
- Query client configured in `apps/web/src/lib/query-client.ts` with 1-minute staleTime
## Key Abstractions
- Purpose: Define typed HTTP endpoints with OpenAPI validation
- Examples: `apps/api/src/routes/user/user.routes.ts`
- Pattern: Use `createRoute` from `@hono/zod-openapi` with Zod schemas for request/response bodies
- Purpose: Implement route logic with full type safety
- Examples: `apps/api/src/routes/user/user.handlers.ts`
- Pattern: Typed handler functions receiving Hono context, accessing database and request state
- Purpose: Define typed database tables and infer Zod schemas
- Examples: `apps/api/src/db/schema/user.ts`
- Pattern: Drizzle ORM SQLite tables with `createSelectSchema` for automatic Zod validation schemas
- Purpose: Compose subrouters into main application
- Examples: `apps/api/src/routes/user/user.index.ts`
- Pattern: Create OpenAPIHono router, attach routes via `.openapi()`, export as module
- Purpose: Reusable UI components with consistent styling
- Examples: `apps/web/src/components/ui/*`
- Pattern: Radix UI + TailwindCSS components wrapped with class-variance-authority for variants
- Purpose: Wrap authenticated routes with shared sidebar/header
- Examples: `apps/web/src/routes/_authenticated.tsx`
- Pattern: TanStack Router group routes with underscore prefix, implement layout component
## Entry Points
- Location: `apps/api/src/app.ts`
- Triggers: Cloudflare Workers request
- Responsibilities: Initialize Hono app, register all routes, configure OpenAPI documentation
- Location: `apps/api/src/lib/create-app.ts`
- Triggers: Before routing layer
- Responsibilities: Serve static assets from Cloudflare ASSETS binding, fallback to index.html for SPA routes
- Location: `apps/web/src/main.tsx`
- Triggers: Browser page load
- Responsibilities: Initialize React root, create React Router instance, render RouterProvider
- Location: `apps/web/src/routes/__root.tsx`
- Triggers: Router initialization
- Responsibilities: Wrap entire app with QueryClientProvider and devtools
## Error Handling
- API errors: Use OpenAPI error schema responses (e.g., `HttpStatusCodes.NOT_FOUND`)
- Route validation: Hono with `@hono/zod-openapi` validates request bodies before handler
- Database queries: Handlers check result length and return appropriate HTTP status
- Middleware errors: `stoker/middlewares` `onError` handler catches exceptions
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
