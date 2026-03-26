# Testing Patterns

**Analysis Date:** 2026-03-26

## Test Framework

**Runner:**
- Vitest 3.2.4 with Cloudflare Workers pool
- Custom pool: `@cloudflare/vitest-pool-workers` v0.10.5
- Config: `apps/api/vitest.config.ts`

**Assertion Library:**
- Vitest built-in `expect()` API

**Run Commands:**
```bash
pnpm run test              # Run all tests in all workspaces via monorepo scripts
npm run test               # In API package: run vitest with NODE_ENV=test
npm run test -- --watch    # Watch mode (inferred from vitest CLI)
npm run test -- --coverage # Coverage report (vitest handles coverage)
```

## Test File Organization

**Location:**
- Co-located with implementation files
- Test file and source file in same directory

**Naming:**
- Pattern: `entity.test.ts`
- Example: `src/routes/user/user.test.ts` (co-located with `user.handlers.ts` and `user.routes.ts`)

**Structure:**
```
apps/api/src/
├── routes/
│   ├── user/
│   │   ├── user.handlers.ts       # Handlers
│   │   ├── user.routes.ts         # Route definitions
│   │   ├── user.index.ts          # Router export
│   │   └── user.test.ts           # Tests (co-located)
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, beforeAll, expect } from "vitest";
import { applyD1Migrations, env } from "cloudflare:test";

describe("users routes", () => {
  beforeAll(async () => {
    // Database setup with migrations
    await applyD1Migrations(testEnv.DB, testEnv.TEST_MIGRATIONS);
  });

  it("get /users returns 404 when no users found", async () => {
    // Test implementation
  });

  it("get /users lists all users", async () => {
    // Test implementation
  });
});
```

**Patterns:**
- Use `describe()` blocks to group related tests by route/feature
- Use `it()` for individual test cases
- Use `beforeAll()` to set up database migrations once per suite
- No `afterEach()` cleanup observed; database is isolated per test via Miniflare

## Mocking

**Framework:** None detected - Vitest with Cloudflare Workers isolation

**Patterns:**
- No explicit mocking library used
- Database queries go against in-memory D1 database via Miniflare
- HTTP requests tested via `testClient()` from Hono

**What to Mock:**
- HTTP clients: handled by `testClient()` from hono/testing which bypasses actual HTTP
- Database: handled by Cloudflare Workers pool with isolated storage and D1 migrations

**What NOT to Mock:**
- Database queries: use real D1 with migrations to test actual SQL behavior
- Route handlers: test actual handler logic via testClient
- Middleware: test middleware behavior as part of route tests

## Fixtures and Factories

**Test Data:**
```typescript
// Direct data insertion in tests
const testUser = {
  id: crypto.randomUUID(),
  username: "testuser",
  email: "test@example.com",
  passwordHash: "hashedpassword",
};

await db.insert(users).values(testUser);
```

**Location:**
- Test data created inline within test cases
- No separate fixtures file
- Database accessed via `createDb(typedEnv)` helper in tests

## Coverage

**Requirements:** Not detected - no coverage thresholds enforced

**View Coverage:**
```bash
npm run test -- --coverage  # Vitest coverage command
```

## Test Types

**Unit Tests:**
- Route handler tests are the primary pattern
- Each handler gets multiple test cases covering success and error paths
- Scope: individual route endpoint behavior

**Integration Tests:**
- API route tests with real database (isolated via Miniflare)
- Tests verify handler + middleware + database integration
- No separate integration test structure; routes include integration testing

**E2E Tests:**
- Not used in codebase
- Web app has no test files visible
- End-to-end testing would require external tools (Playwright, Cypress, etc.)

## Testing Infrastructure

**Cloudflare Workers Setup:**
```typescript
// vitest.config.ts configuration
poolOptions: {
  workers: {
    isolatedStorage: true,              // Each test gets isolated storage
    wrangler: {
      configPath: "./wrangler.jsonc",   // Use wrangler config
    },
    miniflare: {
      bindings: { TEST_MIGRATIONS: migrations },  // Inject migrations
    },
  },
}

// Path alias for imports in tests
resolve: {
  alias: {
    "@/api": path.resolve(__dirname, "./src"),
  },
}
```

**Database Preparation:**
```typescript
// tests/user.test.ts
import { applyD1Migrations, env } from "cloudflare:test";
import { readD1Migrations } from "@cloudflare/vitest-pool-workers/config";

// Migrations loaded at config time and injected into test bindings
const migrations = await readD1Migrations(
  path.join(__dirname, "src", "db", "migrations")
);

// Applied before each test suite
beforeAll(async () => {
  await applyD1Migrations(testEnv.DB, testEnv.TEST_MIGRATIONS);
});
```

## Common Patterns

**HTTP Testing with testClient:**
```typescript
import { testClient } from "hono/testing";

const client = testClient(createApp().route("/users", router), env);

// GET request test
const response = await client.api.users.$get();
expect(response.status).toBe(404);
if (response.status === 404) {
  const json = await response.json();
  expect(json.message).toBe("Users not found");
}
```

**Type-safe HTTP Client:**
- `testClient` is fully typed from route definitions
- Access routes via `client.api.users.$get()` with autocomplete
- Response status and JSON body are type-aware

**Database Testing:**
```typescript
// Create db instance in test context
const db = createDb(typedEnv);

// Direct insert for test data setup
await db.insert(users).values(testUser);

// Query and verify
const dbUsers = await db.query.users.findMany();
expect(dbUsers).toHaveLength(1);
```

**Status Code Verification:**
```typescript
// Always verify response status first
expect(response.status).toBe(200);

// Parse JSON only if status matches
if (response.status === 200) {
  const json = await response.json();
  expect(Array.isArray(json)).toBe(true);
}
```

**Property Assertions:**
```typescript
// Verify expected properties exist
expect(json[0]).toHaveProperty("id");
expect(json[0]).toHaveProperty("username");

// Verify sensitive fields are excluded
expect(json[0]).not.toHaveProperty("passwordHash");
expect(json[0]).not.toHaveProperty("createdAt");
```

## Test Environment

**Node Environment:**
- Tests run with `NODE_ENV=test` via `cross-env` in package.json script
- Cloudflare bindings injected via test pool config
- D1 database migrated before suite runs

**Bindings Available to Tests:**
```typescript
// env object from "cloudflare:test" contains:
// - DB: D1Database instance
// - TEST_MIGRATIONS: loaded migrations
// - Other Cloudflare bindings
```

## Known Gaps

**No web app tests:** React/web components have no test files
**No E2E tests:** No Playwright, Cypress, or similar configuration
**No mock library:** MSW or similar not configured for HTTP mocking
**Single test file:** Only one test file exists (`user.test.ts`); pattern not yet established across full codebase

---

*Testing analysis: 2026-03-26*
