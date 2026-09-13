# Prototype demo guide

This is a self-contained prototype. When `DATABASE_URL` is not set, the API automatically uses an in-memory demo store. No Supabase, PostgreSQL, migration, seed, or Storage bucket is required. Demo changes reset when the backend restarts.

## Run it

Open two terminals from the repository root.

```powershell
# Terminal 1 - API
npm install
npm run dev
```

```powershell
# Terminal 2 - user interface
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Vendor | vendor@example.com | Vendor123! |
| Admin | admin@example.com | Admin123! |
| Buyer | buyer@example.com | Buyer123! |

## Suggested demonstration

1. Open `/marketplace` before signing in to show the public verified listing and search.
2. Sign in as the vendor. Show the dashboard and inventory list.
3. Add an inventory item with an old purchase date (more than 60 days ago) to demonstrate automatic deadstock flagging.
4. From **Inventory**, select an item under **Submit an item for verification**. The prototype supplies a demo proof image, so no external file storage is needed.
5. Sign out and sign in as the admin. Open **Admin** and approve the prepared medical-kit verification record.
6. Return to the marketplace to show the buyer-facing listing/search experience.

## What is real in this prototype

- React UI calls the live local Express API.
- Authentication tokens, role protection, inventory lifecycle rules, verification rules, and approval are exercised through the API.
- Data is stored only in process memory for the demo.

## Intentional prototype limits

- Restarting the API resets all changes and restores the demo accounts/data.
- Proof upload uses an in-browser/data URL fallback without Supabase. The Inventory screen uses a generated proof image for the quickest demo.
- Payments, purchase transactions, analytics, and deployment are outside this prototype scope.
- To use PostgreSQL/Supabase later, create `.env` with `DATABASE_URL` and the Supabase variables, then run the Prisma commands described in `README.md`.

## Checks

```powershell
npm test
npm run typecheck
npm run build
cd frontend
npm test
npm run typecheck
npm run build
```
