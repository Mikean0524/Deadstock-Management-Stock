# Deadstock Management Prototype

Person 3's initial vertical slice: proof upload and deterministic verification, administrator review, verified-only marketplace publication, a rule-engine test suite, and CI.

## Coordination contract

This code deliberately consumes Aryan's Prisma/Auth foundation. The shared `inventoryItem`, `verificationRecord`, and `listing` Prisma models plus JWT middleware that assigns `req.user = { id, role }` now live in the repo, so the Person 3 slice can sit on top of them.

The precise handoff details are in [docs/person3-integration-contract.md](docs/person3-integration-contract.md).

## Setup

1. Copy `.env.example` to `.env` and enter the Supabase/PostgreSQL values.
2. Run `npm install`, `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed`.
3. Run `npm run dev`.
4. Create a private Supabase Storage bucket named `verification-proofs` (or set `SUPABASE_PROOF_BUCKET`).

Demo accounts created by `npm run db:seed`:

- Vendor: `vendor@example.com` / `Vendor123!`
- Buyer: `buyer@example.com` / `Buyer123!`
- Admin: `admin@example.com` / `Admin123!`

Run `npm test` for the unit and API tests, and `npm run typecheck` plus `npm run build` for verification.

## Person 3 API slice

- `POST /api/verification/:inventoryId/proof` — vendor multipart upload (`proof`)
- `POST /api/verification/:inventoryId/submit` — vendor JSON `{ proofUrl, notes? }`
- `GET /api/verification/admin/queue` — administrator manual-review queue
- `PATCH /api/verification/:verificationId/review` — administrator `{ decision: APPROVE|REJECT, notes? }`
- `POST /api/listings` — vendor publishes only a `VERIFIED` inventory item
- `GET /api/listings/marketplace?search=` — public published-listing browse/search

The prototype intentionally excludes purchase transactions, analytics, payment processing, advanced compliance, and deployment.

## Independent Person 3 deliverables completed now

- Rule engine unit tests and the Postman collection in `postman/` can be used immediately.
- Mock-ready React/Tailwind Admin Review and Buyer Marketplace pages are in `frontend/src/features/person3/`; Person 1 can add them to the shared Vite router now.
- `person3-api.ts` is the API adapter to switch the screens from mock data to the live API after Aryan completes authentication, inventory, and Prisma.
