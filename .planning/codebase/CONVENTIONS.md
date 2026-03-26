# Coding Conventions

**Analysis Date:** 2026-03-26

## Naming Patterns

**Files:**
- kebab-case for all filenames (enforced by `unicorn/filename-case` ESLint rule)
- Component files: `component-name.tsx` (e.g., `example.tsx`, `alert-dialog.tsx`)
- Handler files: `entity.handlers.ts` (e.g., `user.handlers.ts`)
- Route files: `entity.routes.ts` (e.g., `user.routes.ts`)
- Index files: `entity.index.ts` (e.g., `user.index.ts`)
- Test files: `entity.test.ts` (co-located with implementation)

**Functions:**
- camelCase for all function names
- Handler functions use descriptive action verbs: `listUsers`, `createUser`, `updateUser`
- Factory/creation functions prefixed with `create`: `createApp()`, `createRouter()`, `createDb()`
- Middleware functions as noun factories: `pinoLogger()` returns middleware handler

**Variables:**
- camelCase for all variable declarations
- Constants in UPPER_SNAKE_CASE: `BASE_PATH`, `ZOD_ERROR_MESSAGES`
- Type variables in camelCase: `dbUsers`, `testEnv`, `assetResponse`

**Types:**
- PascalCase for all type definitions: `AppEnv`, `AppOpenAPI`, `AppRouteHandler`, `ListUsersRoute`
- Type names should be descriptive and specific to use case: `ListUsersRoute` not just `UserRoute`
- Type files: `types.ts` (centralized in lib directories)

## Code Style

**Formatting:**
- Indentation: 2 spaces (configured in eslint-config)
- Semicolons: required (enforced by ESLint rule `semi: true`)
- Quotes: double quotes only (configured in eslint-config)

**Linting:**
- Tool: ESLint 9.39.1 with @antfu/eslint-config v6.2.0
- Config location: `packages/eslint-config/create-config.js`
- Key configuration:
  - TypeScript strict mode enabled
  - Unicorn naming conventions enforced
  - Perfectionist import sorting enabled
  - Drizzle ORM plugin enabled (for API package)
  - React rules enabled (for web package)
- Custom rules:
  - `ts/consistent-type-definitions: ["error", "type"]` - Use `type` not `interface`
  - `no-console: ["warn"]` - Console use is warned
  - `node/no-process-env: ["error"]` - Direct process.env access forbidden (use validated bindings)
  - `perfectionist/sort-imports: ["error"]` - Imports must be alphabetically sorted
  - `unicorn/filename-case: ["error", "kebabCase"]` - All filenames must be kebab-case

## Import Organization

**Order:**
1. External library imports (hono, drizzle, etc.)
2. Type imports from external libraries (`import type { ... } from ...`)
3. Relative imports from current workspace (using path aliases)
4. Type-only relative imports
5. Side-effect imports (CSS, etc.)

**Path Aliases:**
- `@/api` → `./src` (in API app, configured in vitest.config.ts)
- `@base-project/web` → used in web app for imports from shared components/lib
- `@base-project/api` → used for shared route types and exports
- `@base-project/api-client` → used for client types

**Example from codebase:**
```typescript
// External libraries first
import { notFound, onError } from "stoker/middlewares";
import type { AppOpenAPI } from "./types";
// Relative path aliases
import { pinoLogger } from "@/api/middlewares/pino-logger";
import { BASE_PATH } from "@/api/lib/constants";
import createRouter from "@/api/lib/create-router";
```

## Error Handling

**Patterns:**
- HTTP errors return appropriate status codes via Hono's `c.json()` with message objects
- 404 errors: return `{ message: "Resource not found" }` with `NOT_FOUND` status code
- Database errors: handled by Stoker's `onError` middleware which catches and formats them
- Validation errors: Zod parsing errors are caught and formatted by OpenAPI middleware

**Example from `user.handlers.ts`:**
```typescript
if (dbUsers.length === 0) {
  c.var.logger.info("Not found");
  return c.json({ message: "Users not found" }, HttpStatusCodes.NOT_FOUND);
}
```

- No custom error classes in codebase; rely on middleware error handling
- Error schemas defined using Stoker utilities: `createMessageObjectSchema()`

## Logging

**Framework:** Hono-Pino with Pino logger v10.1.0

**Patterns:**
- Access logger via `c.var.logger` in route handlers
- Configure in `middlewares/pino-logger.ts`
- Request ID captured from Cloudflare headers (`cf-ray`) or `x-request-id`, fallback to random UUID
- Log level set via `LOG_LEVEL` environment binding (defaults to "info")
- Browser-friendly output configured (no Node.js transports)

**Usage:**
```typescript
c.var.logger.info("Message") // Standard info log
```

## Comments

**When to Comment:**
- Comments are minimal; code structure and naming should be self-documenting
- Explain WHY decisions were made, not WHAT the code does
- Complex business logic that isn't obvious from variable/function names

**JSDoc/TSDoc:**
- Used sparingly for exported functions and types
- Type annotations serve as inline documentation
- No strict requirement for JSDoc on all functions

## Function Design

**Size:** Functions are concise and focused on single responsibilities
- Route handlers are 5-20 lines typically
- Handlers delegate to db/utils for business logic

**Parameters:**
- Use destructuring for objects
- Type context object as `c` from Hono
- Leverage Hono's middleware context pattern for dependencies

**Return Values:**
- Route handlers return Hono response objects (`c.json()`, `c.text()`)
- Handlers use Stoker's HTTP status code utilities (`HttpStatusCodes.OK`, `HttpStatusCodes.NOT_FOUND`)

**Example:**
```typescript
export const listUsers: AppRouteHandler<ListUsersRoute> = async (c) => {
  const db = createDb(c.env);
  const dbUsers = await db.query.users.findMany();

  if (dbUsers.length === 0) {
    return c.json({ message: "Users not found" }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(selectUserSchema.array().parse(dbUsers), HttpStatusCodes.OK);
};
```

## Module Design

**Exports:**
- Named exports for most code
- Default exports only for factory functions and app/router creators
- Explicit export lists in index files for re-export control

**Example patterns:**
```typescript
// Factory function - default export
export default function createApp() { ... }

// Named handler exports
export const listUsers: AppRouteHandler<ListUsersRoute> = async (c) => { ... }

// Type exports
export type ListUsersRoute = typeof listUsers;
export type AppEnv = { ... }
```

**Barrel Files:**
- Used for re-exporting from index files
- `src/routes/index.ts` re-exports route definitions
- `src/db/schema/index.ts` re-exports schema exports

**Type Definitions Strategy:**
- All app-level types in `lib/types.ts`
- Domain-specific types co-located with domain (e.g., `user.routes.ts` exports `ListUsersRoute`)
- Schema types auto-generated from Drizzle ORM via `createSelectSchema()`

---

*Convention analysis: 2026-03-26*
