import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { issueAuthToken } from "./modules/auth/token.js";
import { app } from "./app.js";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    users: {
      findUnique: vi.fn(),
      create: vi.fn()
    },
    inventoryItem: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn()
    }
  }
}));

vi.mock("./config/prisma.js", () => ({ prisma: mockPrisma }));

const vendor = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Test Vendor",
  email: "vendor@example.com",
  role: "VENDOR" as const,
  created_at: new Date("2026-01-01T00:00:00.000Z")
};

const inventory = {
  id: "22222222-2222-4222-8222-222222222222",
  vendor_id: vendor.id,
  product_name: "Surplus chairs",
  category: "FURNITURE",
  quantity: 4,
  purchase_date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
  expiry_date: null,
  condition: "GOOD",
  status: "DEADSTOCK_FLAGGED",
  created_at: new Date(),
  deadstock_flagged_at: new Date()
};

describe("Aryan API foundation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("registers a vendor and returns the shared auth token shape", async () => {
    mockPrisma.users.findUnique.mockResolvedValue(null);
    mockPrisma.users.create.mockResolvedValue({ ...vendor, password_hash: "hidden" });

    const response = await request(app).post("/api/auth/register").send({
      name: vendor.name,
      email: vendor.email,
      password: "Vendor123!",
      role: "VENDOR"
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user).toMatchObject({ id: vendor.id, role: "VENDOR" });
    expect(response.body.data.token.split(".")).toHaveLength(3);
  });

  it("protects inventory routes and creates vendor-owned inventory", async () => {
    const token = issueAuthToken({ id: vendor.id, role: "VENDOR" }, "dev-only-change-me", "12h");
    mockPrisma.inventoryItem.create.mockResolvedValue(inventory);

    const unauthenticated = await request(app).post("/api/inventory").send({});
    expect(unauthenticated.status).toBe(401);

    const response = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        productName: "Surplus chairs",
        category: "FURNITURE",
        quantity: 4,
        purchaseDate: "2025-01-01",
        condition: "GOOD"
      });

    expect(response.status).toBe(201);
    expect(mockPrisma.inventoryItem.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ vendor_id: vendor.id })
    }));
  });

  it("filters aging data using the current lifecycle calculation", async () => {
    const token = issueAuthToken({ id: vendor.id, role: "VENDOR" }, "dev-only-change-me", "12h");
    mockPrisma.inventoryItem.findMany.mockResolvedValue([inventory]);

    const response = await request(app)
      .get("/api/inventory/deadstock")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].status).toBe("DEADSTOCK_FLAGGED");
  });
});
