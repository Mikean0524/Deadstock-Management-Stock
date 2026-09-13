import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { issueAuthToken } from "../auth/token.js";
import { app } from "../../app.js";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    inventoryItem: { findFirst: vi.fn(), update: vi.fn() },
    verificationRecord: { create: vi.fn(), findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn(), findMany: vi.fn() },
    listing: { create: vi.fn(), findMany: vi.fn() }
  }
}));

vi.mock("../../config/prisma.js", () => ({ prisma: mockPrisma }));

const vendorId = "11111111-1111-4111-8111-111111111111";
const adminId = "33333333-3333-4333-8333-333333333333";
const inventoryId = "22222222-2222-4222-8222-222222222222";
const vendorToken = issueAuthToken({ id: vendorId, role: "VENDOR" }, "dev-only-change-me", "12h");
const adminToken = issueAuthToken({ id: adminId, role: "ADMIN" }, "dev-only-change-me", "12h");

const inventory = {
  id: inventoryId, vendor_id: vendorId, product_name: "Surplus chairs", category: "FURNITURE", quantity: 4,
  condition: "GOOD", status: "DEADSTOCK_FLAGGED"
};

describe("Person 3 verification and marketplace API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("automatically verifies a complete, non-regulated deadstock submission", async () => {
    mockPrisma.inventoryItem.findFirst.mockResolvedValue(inventory);
    mockPrisma.verificationRecord.create.mockResolvedValue({ id: "44444444-4444-4444-8444-444444444444" });
    mockPrisma.inventoryItem.update.mockResolvedValue({});

    const response = await request(app)
      .post(`/api/verification/${inventoryId}/submit`)
      .set("Authorization", `Bearer ${vendorToken}`)
      .send({ proofUrl: "https://storage.example/chairs.jpg" });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({ ruleResult: "PASS", verificationStatus: "VERIFIED" });
    expect(mockPrisma.inventoryItem.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: "SUBMITTED_FOR_VERIFICATION" } }));
  });

  it("puts regulated stock in the admin queue and lets only an admin approve it", async () => {
    const regulated = { ...inventory, category: "MEDICAL" };
    mockPrisma.inventoryItem.findFirst.mockResolvedValue(regulated);
    mockPrisma.verificationRecord.create.mockResolvedValue({ id: "44444444-4444-4444-8444-444444444444" });
    mockPrisma.inventoryItem.update.mockResolvedValue({});

    const submitted = await request(app)
      .post(`/api/verification/${inventoryId}/submit`)
      .set("Authorization", `Bearer ${vendorToken}`)
      .send({ proofUrl: "https://storage.example/medical.jpg" });
    expect(submitted.body.data).toMatchObject({ ruleResult: "MANUAL_REVIEW", verificationStatus: "MANUAL_REVIEW" });

    mockPrisma.verificationRecord.findMany.mockResolvedValue([{ id: "44444444-4444-4444-8444-444444444444", inventory: regulated }]);
    const queue = await request(app).get("/api/verification/admin/queue").set("Authorization", `Bearer ${adminToken}`);
    expect(queue.status).toBe(200);
    expect(queue.body.data).toHaveLength(1);

    mockPrisma.verificationRecord.findUnique.mockResolvedValue({ id: "44444444-4444-4444-8444-444444444444", verification_status: "MANUAL_REVIEW", notes: null });
    mockPrisma.verificationRecord.update.mockResolvedValue({ id: "44444444-4444-4444-8444-444444444444", verification_status: "VERIFIED" });
    const approved = await request(app)
      .patch("/api/verification/44444444-4444-4444-8444-444444444444/review")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ decision: "APPROVE" });
    expect(approved.status).toBe(200);
    expect(mockPrisma.verificationRecord.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ verification_status: "VERIFIED", reviewer_id: adminId }) }));
  });

  it("enforces verified-before-published and exposes only published marketplace entries", async () => {
    mockPrisma.inventoryItem.findFirst.mockResolvedValue(inventory);
    mockPrisma.verificationRecord.findFirst.mockResolvedValue(null);
    const blocked = await request(app).post("/api/listings").set("Authorization", `Bearer ${vendorToken}`).send({ inventoryId, title: "Surplus chairs", description: "Four good-condition office chairs.", price: 850, quantity: 2 });
    expect(blocked.status).toBe(409);

    mockPrisma.verificationRecord.findFirst.mockResolvedValue({ id: "verified-record", verification_status: "VERIFIED" });
    mockPrisma.listing.create.mockResolvedValue({ id: "listing-id", listing_status: "PUBLISHED" });
    const published = await request(app).post("/api/listings").set("Authorization", `Bearer ${vendorToken}`).send({ inventoryId, title: "Surplus chairs", description: "Four good-condition office chairs.", price: 850, quantity: 2 });
    expect(published.status).toBe(201);

    mockPrisma.listing.findMany.mockResolvedValue([{ id: "listing-id", listing_status: "PUBLISHED" }]);
    const marketplace = await request(app).get("/api/listings/marketplace?search=chairs");
    expect(marketplace.status).toBe(200);
    expect(marketplace.body.data).toHaveLength(1);
  });
});
