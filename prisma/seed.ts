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

  console.log("Seeded demo users and inventory.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
