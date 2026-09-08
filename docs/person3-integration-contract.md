# Person 3 integration contract

This implementation uses the frozen shared contract and has no fake database, inventory, or user data.

Person 2 must expose a Prisma client with these agreed models and fields:

- `inventoryItem`: `id`, `vendor_id`, `product_name`, `category`, `quantity`, `condition`, `status`
- `verificationRecord`: `id`, `inventory_id`, `submitted_by`, `proof_url`, `verification_status`, `rule_result`, `notes`, `reviewer_id`, `reviewed_at`, `submitted_at`
- `listing`: `id`, `inventory_id`, `vendor_id`, `title`, `description`, `price`, `quantity`, `listing_status`, `published_at`

Required values are unchanged: inventory `DEADSTOCK_FLAGGED` / `SUBMITTED_FOR_VERIFICATION`; verification `PENDING`, `RULE_CHECK`, `PASS`, `REJECT`, `MANUAL_REVIEW`, `VERIFIED`; listing `DRAFT`, `PENDING_VERIFICATION`, `VERIFIED`, `PUBLISHED`, `SOLD`; roles `VENDOR`, `BUYER`, `ADMIN`.

Person 2's JWT middleware must set `req.user` to `{ id: UUID, role: VENDOR | BUYER | ADMIN }` before the Person 3 routers. This module deliberately derives vendor and reviewer IDs from that identity, never request-body IDs.

The Person 3 router mounts are `/api/verification` and `/api/listings`.
