# Base Project

A neutral full-stack monorepo scaffold for starting a new full-stack application.

## Included

- `apps/web`: React + Vite + TanStack Router + TanStack Query + Tailwind v4
- `apps/api`: Hono + OpenAPI + Drizzle + Cloudflare Workers/D1
- `packages/api-client`: shared typed API client package
- `packages/eslint-config`: shared ESLint config package

## Workspace Layout

```text
base-project/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── api-client/
│   └── eslint-config/
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Expected local services:
- Web: `http://localhost:5173`
- API: `http://localhost:8787`
- API reference: `http://localhost:8787/reference`

## Notes

- Package scope has been renamed to `@base-project/*`.
- The API worker name and local D1 binding use `base-project-api` as a placeholder.
- Replace placeholder database IDs and any sample content before production use.

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
```

For Cloudflare setup, update [`apps/api/wrangler.jsonc`](./apps/api/wrangler.jsonc) and then run the Wrangler D1 commands that match your environment names.
