import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/modules/auth/password.js";

const prisma = new PrismaClient();

async function main() {
  const vendor = await prisma.users.upsert({
    where: { email: "vendor@example.com" },
    update: {},
    create: {
      name: "Demo Vendor",
      email: "vendor@example.com",
      password_hash: await hashPassword("Vendor123!"),
      role: "VENDOR"
    }
  });

  await prisma.users.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      name: "Demo Buyer",
      email: "buyer@example.com",
      password_hash: await hashPassword("Buyer123!"),
      role: "BUYER"
    }
  });

  await prisma.users.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@example.com",
      password_hash: await hashPassword("Admin123!"),
      role: "ADMIN"
    }
  });

  const inventoryCount = await prisma.inventoryItem.count({ where: { vendor_id: vendor.id } });
  if (inventoryCount === 0) {
    const now = Date.now();
    await prisma.inventoryItem.createMany({
      data: [
        {
          vendor_id: vendor.id,
          product_name: "Demo surplus chairs",
          category: "FURNITURE",
          quantity: 12,
          purchase_date: new Date(now - 75 * 24 * 60 * 60 * 1000),
          condition: "GOOD",
          status: "DEADSTOCK_FLAGGED",
          deadstock_flagged_at: new Date(now)
        },
        {
          vendor_id: vendor.id,
          product_name: "Demo cotton shirts",
          category: "APPAREL",
          quantity: 24,
          purchase_date: new Date(now - 40 * 24 * 60 * 60 * 1000),
          condition: "NEW",
          status: "AGING"
        }
      ]
    });
  }

  // Person 3 demo states: one automatically verified item visible to buyers,
  // and one regulated item waiting for an administrator's decision.
  const verifiedInventory = await prisma.inventoryItem.findFirst({
    where: { vendor_id: vendor.id, product_name: "Demo surplus chairs" }
  });
  if (verifiedInventory) {
    const verifiedRecord = await prisma.verificationRecord.findFirst({
      where: { inventory_id: verifiedInventory.id, verification_status: "VERIFIED" }
    });
    if (!verifiedRecord) {
      await prisma.verificationRecord.create({
        data: {
          inventory_id: verifiedInventory.id,
          submitted_by: vendor.id,
          proof_url: "https://placehold.co/720x420?text=Chair+Batch+Proof",
          verification_status: "VERIFIED",
          rule_result: { decision: "PASS", checks: [{ name: "deadstockEligibility", passed: true }] }
        }
      });
    }
    const existingListing = await prisma.listing.findFirst({ where: { inventory_id: verifiedInventory.id, listing_status: "PUBLISHED" } });
    if (!existingListing) {
      await prisma.listing.create({
        data: { inventory_id: verifiedInventory.id, vendor_id: vendor.id, title: "Verified surplus office chairs", description: "Good-condition surplus office chairs ready for resale.", price: 850, quantity: 12, listing_status: "PUBLISHED", published_at: new Date() }
      });
    }
  }

  let manualReviewInventory = await prisma.inventoryItem.findFirst({
    where: { vendor_id: vendor.id, product_name: "Demo first-aid kits" }
  });
  if (!manualReviewInventory) {
    manualReviewInventory = await prisma.inventoryItem.create({
      data: { vendor_id: vendor.id, product_name: "Demo first-aid kits", category: "MEDICAL", quantity: 8, purchase_date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), condition: "NEW", status: "SUBMITTED_FOR_VERIFICATION", deadstock_flagged_at: new Date() }
    });
  }
  const pendingReview = await prisma.verificationRecord.findFirst({ where: { inventory_id: manualReviewInventory.id, verification_status: "MANUAL_REVIEW" } });
  if (!pendingReview) {
    await prisma.verificationRecord.create({
      data: {
        inventory_id: manualReviewInventory.id,
        submitted_by: vendor.id,
        proof_url: "https://placehold.co/720x420?text=Medical+Batch+Proof",
        verification_status: "MANUAL_REVIEW",
        rule_result: { decision: "MANUAL_REVIEW", checks: [{ name: "regulatedCategory", passed: false, message: "Regulated categories require an administrator review." }] }
      }
    });
  }

  console.log("Seeded demo users, inventory, verification states, and marketplace listing.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
