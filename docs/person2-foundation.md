# Aryan Backend Foundation

This document captures the prototype slice owned by Aryan.

## Scope

- Express backend foundation
- Prisma schema for shared prototype data
- JWT-based auth middleware
- Register/login/me endpoints
- Inventory CRUD
- Aging and deadstock status calculation
- Zod validation
- Centralized API error handling
- Backend unit tests for core services

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/inventory`
- `GET /api/inventory`
- `GET /api/inventory/aging`
- `GET /api/inventory/deadstock`
- `GET /api/inventory/:id`
- `PATCH /api/inventory/:id`
- `DELETE /api/inventory/:id`

## Shared Models

- `users`
- `inventoryItem`
- `verificationRecord`
- `listing`

## Environment Variables

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PASSWORD_SALT_ROUNDS`
- `AGING_THRESHOLD_DAYS`
- `DEADSTOCK_THRESHOLD_DAYS`
- `PORT`

## Prerequisites For Other Team Members

- Prisma schema must be generated before the backend can run locally.
- Apply the initial migration with `npm run db:migrate` and load demo data with `npm run db:seed`.
- The frontend and Person 3 routes depend on the auth token shape `{ id, role }`.
- Person 3 will also depend on the shared `inventoryItem`, `verificationRecord`, and `listing` Prisma fields staying aligned with the contract.

## Verification Commands

- `npm test`
- `npm run typecheck`
- `npm run build`
