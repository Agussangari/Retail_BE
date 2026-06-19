# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Node.js/Express/PostgreSQL backend for a retail system (inventory, sales, customers, categories). Domain language and DB schema are in Spanish (`productos`, `ventas`, `clientes`, `categorias`); keep new code consistent with that naming.

## Commands

```bash
cp .env.example .env        # first-time setup
npm install
docker-compose up -d        # starts Postgres 15 on localhost:5432 (db: retail_db)
npm run db:seed             # runs src/db/migrations.sql then seeds sample data (idempotent — skips seeding if categorias is non-empty)
npm run dev                 # nodemon src/server.js, auto-reload
npm start                   # node src/server.js
```

There is no test suite and no lint command configured in this repo.

API docs are served at `http://localhost:3000/api-docs` (swagger-ui), generated from JSDoc `@swagger` comments inside `src/routes/*.js`. Only `category.routes.js` currently has these comments — follow that file's format if adding docs for other routes.

## Architecture

Strict layered architecture, one set of files per resource (category, customer, product, sale):

```
routes/*.routes.js        Express router + Zod request schema + validate() middleware
controllers/*.controller.js   Thin HTTP adapters: parse req, call service, shape res, next(error) on throw
services/*.service.js     Business logic, existence checks, orchestrates repositories, owns transactions
repositories/*.repository.js  Only layer that writes SQL / talks to pg
```

Controllers, services, and repositories are exported as singleton instances (`module.exports = new XService()`), not classes — `require` the module and call methods directly.

### Request flow

`app.js` mounts routes under `/api/{categorias,productos,clientes,ventas}` → router validates body/query/params via `middlewares/validate.js` (Zod) → controller → service → repository → `config/db.js` (`pg.Pool`). Unmatched routes fall through to a `NotFoundError`; everything funnels into `middlewares/errorHandler.js`.

### Error handling

All thrown errors should be instances from `src/utils/errors.js` (`NotFoundError`, `ValidationError`, `BusinessError`, or `BaseError` directly) carrying `statusCode`/`code`/`details`. `errorHandler.js` also special-cases raw Postgres error codes `23505` (unique violation → 409) and `23503` (FK violation → 409) for errors that bubble up unwrapped from the db layer. Every response is JSON-shaped as either `{ success: true, data }` / `{ success: true, message }` or `{ success: false, error: { code, message, details } }`.

### Transactions (see `sale.service.js` / `sale.repository.js`)

Only the sale flow needs multi-statement transactions (creating a sale deducts stock from multiple products; cancelling restores it). The pattern:

1. Service calls `db.getClient()` to check out a dedicated client, then `BEGIN` / `COMMIT` / `ROLLBACK` (in a try/catch/finally that always `client.release()`s).
2. The service passes that `client` down to repository methods as an explicit last argument; repository methods accept an optional `client` param and fall back to the shared pool (`db`) when called outside a transaction, e.g. `updateState(id, estado, client)`.
3. Row locking (`SELECT ... FOR UPDATE`) is used when reading a product's stock inside the transaction to prevent oversell under concurrent sales — preserve this when touching stock-mutation code.

When adding new multi-step writes, follow this same explicit-client-passing pattern rather than introducing an ORM-style unit-of-work abstraction.

### Database

Schema lives in `src/db/migrations.sql` (plain SQL, `CREATE TABLE IF NOT EXISTS`, no migration framework/versioning — it's re-run on every `db:seed`). Tables: `categorias`, `clientes`, `productos`, `ventas`, `detalle_ventas` (sale line items, joined to `productos` for display). `productos.stock_minimo` drives the low-stock endpoint (`GET /api/productos/stock-bajo`, `stock_actual <= stock_minimo`). `ventas.estado` is constrained to `pendiente | confirmada | anulada`.

Config (`src/config/db.js`) exposes `query()` for one-off statements and `getClient()` for transactions; both are used throughout the repository layer depending on whether a transaction is in progress.
