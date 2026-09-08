CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "Role" AS ENUM ('VENDOR', 'BUYER', 'ADMIN');
CREATE TYPE "InventoryCondition" AS ENUM ('NEW', 'GOOD', 'DAMAGED');
CREATE TYPE "InventoryStatus" AS ENUM ('ACTIVE', 'AGING', 'DEADSTOCK_FLAGGED', 'SUBMITTED_FOR_VERIFICATION');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'RULE_CHECK', 'PASS', 'REJECT', 'MANUAL_REVIEW', 'VERIFIED');
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'VERIFIED', 'PUBLISHED', 'SOLD');

CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "product_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "condition" "InventoryCondition" NOT NULL,
    "status" "InventoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadstock_flagged_at" TIMESTAMP(3),
    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "verification_records" (
    "id" UUID NOT NULL,
    "inventory_id" UUID NOT NULL,
    "submitted_by" UUID NOT NULL,
    "proof_url" TEXT NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rule_result" JSONB,
    "notes" TEXT,
    "reviewer_id" UUID,
    "reviewed_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "listings" (
    "id" UUID NOT NULL,
    "inventory_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "listing_status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "inventory_items_vendor_id_status_idx" ON "inventory_items"("vendor_id", "status");
CREATE INDEX "inventory_items_purchase_date_idx" ON "inventory_items"("purchase_date");
CREATE INDEX "verification_records_inventory_id_verification_status_idx" ON "verification_records"("inventory_id", "verification_status");
CREATE INDEX "verification_records_verification_status_submitted_at_idx" ON "verification_records"("verification_status", "submitted_at");
CREATE INDEX "listings_listing_status_published_at_idx" ON "listings"("listing_status", "published_at");
CREATE INDEX "listings_vendor_id_listing_status_idx" ON "listings"("vendor_id", "listing_status");

ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "listings" ADD CONSTRAINT "listings_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "listings" ADD CONSTRAINT "listings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
