# Deadstock Management Prototype

Person 3's initial vertical slice: proof upload and deterministic verification, administrator review, verified-only marketplace publication, a rule-engine test suite, and CI.

## Coordination contract

This code deliberately consumes Person 2's Prisma/Auth foundation. Before running it, Person 2 must provide the agreed `inventoryItem`, `verificationRecord`, and `listing` Prisma models with the field and enum names in the shared build specification, plus JWT middleware that assigns `req.user = { id, role }`.

The precise handoff details are in [docs/person3-integration-contract.md](docs/person3-integration-contract.md).

## Setup

1. Copy `.env.example` to `.env` and enter the Supabase/PostgreSQL values.
2. After Person 2 adds the shared Prisma schema, run `npm install`, `npx prisma generate`, then `npm run dev`.
3. Create a private Supabase Storage bucket named `verification-proofs` (or set `SUPABASE_PROOF_BUCKET`).

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
- `person3-api.ts` is the API adapter to switch the screens from mock data to the live API after Person 2 completes authentication, inventory, and Prisma.
