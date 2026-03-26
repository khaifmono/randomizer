# Architecture

**Analysis Date:** 2026-03-26

## Pattern Overview

**Overall:** Monorepo with backend-frontend separation using Hono API and React frontend

**Key Characteristics:**
- Modular pnpm workspace with three distinct packages
- Type-safe API contracts via Hono RPC and Zod schemas
- Server-driven routing in API, file-based routing in frontend
- OpenAPI-first API design with Scalar documentation
- Cloudflare Workers deployment for API, Vite build for frontend

## Layers

**API Application Layer:**
- Purpose: HTTP request handling, routing, and validation
- Location: `apps/api/src/routes`
- Contains: Route definitions, handlers, request/response schemas
- Depends on: Database layer, middleware layer, external libraries
- Used by: Web app, API client package

**API Business Logic Layer:**
- Purpose: Core application logic, handlers
- Location: `apps/api/src/routes/*/handlers`
- Contains: Handler functions implementing route behavior
- Depends on: Database layer, types, schemas
- Used by: Route definitions

**Database Layer:**
- Purpose: Database connection and schema management
- Location: `apps/api/src/db`
- Contains: Schema definitions (Drizzle ORM), migrations, database initialization
- Depends on: Drizzle ORM, Cloudflare D1
- Used by: Business logic handlers

**Middleware Layer:**
- Purpose: Cross-cutting concerns
- Location: `apps/api/src/middlewares`
- Contains: Logging (Pino), error handling, request context
- Depends on: Hono, Pino
- Used by: App initialization

**Frontend Presentation Layer:**
- Purpose: User interface rendering
- Location: `apps/web/src/components`
- Contains: React components, UI component library, page layouts
- Depends on: React, Radix UI, Lucide icons, TailwindCSS
- Used by: Route components

**Frontend Routing Layer:**
- Purpose: File-based routing and navigation
- Location: `apps/web/src/routes`
- Contains: TanStack Router route files, layout components
- Depends on: TanStack Router, presentation layer
- Used by: Main entry point

**Frontend Data Management Layer:**
- Purpose: Server state and client state management
- Location: `apps/web/src/lib`
- Contains: React Query configuration, utilities
- Depends on: React Query, TanStack Router
- Used by: Route components

**API Client Package:**
- Purpose: Type-safe API client generation
- Location: `packages/api-client/src`
- Contains: Hono RPC client factory
- Depends on: Hono client, API router type
- Used by: Web frontend for API calls

## Data Flow

**HTTP Request to Response:**

1. Request arrives at Hono app in `apps/api/src/app.ts`
2. Middleware stack processes request (logging in `apps/api/src/middlewares/pino-logger.ts`)
3. Router matches route and invokes handler (e.g., `apps/api/src/routes/user/user.handlers.ts`)
4. Handler queries database via Drizzle ORM (schema in `apps/api/src/db/schema`)
5. Response is validated against Zod schema and returned as JSON

**State Management:**

- API: Request-scoped state via Hono context variables (`c.var`)
- Frontend: Server state via React Query, client state via React hooks
- Query client configured in `apps/web/src/lib/query-client.ts` with 1-minute staleTime

## Key Abstractions

**Route Definition Pattern:**
- Purpose: Define typed HTTP endpoints with OpenAPI validation
- Examples: `apps/api/src/routes/user/user.routes.ts`
- Pattern: Use `createRoute` from `@hono/zod-openapi` with Zod schemas for request/response bodies

**Handler Pattern:**
- Purpose: Implement route logic with full type safety
- Examples: `apps/api/src/routes/user/user.handlers.ts`
- Pattern: Typed handler functions receiving Hono context, accessing database and request state

**Database Schema Pattern:**
- Purpose: Define typed database tables and infer Zod schemas
- Examples: `apps/api/src/db/schema/user.ts`
- Pattern: Drizzle ORM SQLite tables with `createSelectSchema` for automatic Zod validation schemas

**Router Pattern:**
- Purpose: Compose subrouters into main application
- Examples: `apps/api/src/routes/user/user.index.ts`
- Pattern: Create OpenAPIHono router, attach routes via `.openapi()`, export as module

**Component Library Pattern:**
- Purpose: Reusable UI components with consistent styling
- Examples: `apps/web/src/components/ui/*`
- Pattern: Radix UI + TailwindCSS components wrapped with class-variance-authority for variants

**Layout Pattern:**
- Purpose: Wrap authenticated routes with shared sidebar/header
- Examples: `apps/web/src/routes/_authenticated.tsx`
- Pattern: TanStack Router group routes with underscore prefix, implement layout component

## Entry Points

**API Server:**
- Location: `apps/api/src/app.ts`
- Triggers: Cloudflare Workers request
- Responsibilities: Initialize Hono app, register all routes, configure OpenAPI documentation

**API Assets Middleware:**
- Location: `apps/api/src/lib/create-app.ts`
- Triggers: Before routing layer
- Responsibilities: Serve static assets from Cloudflare ASSETS binding, fallback to index.html for SPA routes

**Web Frontend:**
- Location: `apps/web/src/main.tsx`
- Triggers: Browser page load
- Responsibilities: Initialize React root, create React Router instance, render RouterProvider

**Root Layout:**
- Location: `apps/web/src/routes/__root.tsx`
- Triggers: Router initialization
- Responsibilities: Wrap entire app with QueryClientProvider and devtools

## Error Handling

**Strategy:** Typed error schemas with Zod validation

**Patterns:**
- API errors: Use OpenAPI error schema responses (e.g., `HttpStatusCodes.NOT_FOUND`)
- Route validation: Hono with `@hono/zod-openapi` validates request bodies before handler
- Database queries: Handlers check result length and return appropriate HTTP status
- Middleware errors: `stoker/middlewares` `onError` handler catches exceptions

## Cross-Cutting Concerns

**Logging:** Pino logger injected into Hono context via middleware in `apps/api/src/middlewares/pino-logger.ts`, accessible as `c.var.logger`

**Validation:** Zod schemas defined in route definitions and database schemas, validated by Hono before handler execution

**Authentication:** Mock implementation in login/signup routes; production should implement AUTH_SECRET based flow in middleware

---

*Architecture analysis: 2026-03-26*
