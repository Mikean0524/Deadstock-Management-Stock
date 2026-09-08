import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { requireAuth, requireRole } from "../../types/auth.js";
import { evaluateInventoryLifecycle, formatInventoryLifecycleSummary } from "./aging.js";

const inventoryCondition = z.enum(["NEW", "GOOD", "DAMAGED"]);
const inventoryStatus = z.enum(["ACTIVE", "AGING", "DEADSTOCK_FLAGGED", "SUBMITTED_FOR_VERIFICATION"]);
const inventoryCreateSchema = z.object({
  productName: z.string().min(2).max(120),
  category: z.string().min(2).max(120),
  quantity: z.number().int().positive(),
  purchaseDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional().nullable(),
  condition: inventoryCondition
});
const inventoryUpdateSchema = inventoryCreateSchema.partial().extend({
  status: inventoryStatus.optional()
});

function inventoryWhereForUser(userId: string, role: string) {
  return role === "ADMIN" ? {} : { vendor_id: userId };
}

function mapInventory(item: {
  id: string;
  vendor_id: string;
  product_name: string;
  category: string;
  quantity: number;
  purchase_date: Date;
  expiry_date: Date | null;
  condition: string;
  status: string;
  created_at: Date;
  deadstock_flagged_at: Date | null;
}) {
  const lifecycle = evaluateInventoryLifecycle({
    purchaseDate: item.purchase_date,
    expiryDate: item.expiry_date,
    currentStatus: item.status as "ACTIVE" | "AGING" | "DEADSTOCK_FLAGGED" | "SUBMITTED_FOR_VERIFICATION"
  });
  return {
    ...item,
    status: lifecycle.status,
    deadstock_flagged_at: item.deadstock_flagged_at ?? lifecycle.deadstockFlaggedAt,
    lifecycle: formatInventoryLifecycleSummary(lifecycle)
  };
}

function lifecycleItems(
  items: Parameters<typeof mapInventory>[0][],
  statuses: Array<"AGING" | "DEADSTOCK_FLAGGED">
) {
  return items.map(mapInventory).filter((item) => statuses.includes(item.status as "AGING" | "DEADSTOCK_FLAGGED"));
}

export const inventoryRouter = Router();

inventoryRouter.use(requireAuth, requireRole("VENDOR", "ADMIN"));

inventoryRouter.post("/", async (req, res, next) => {
  try {
    const body = inventoryCreateSchema.parse(req.body);
    const lifecycle = evaluateInventoryLifecycle({
      purchaseDate: body.purchaseDate,
      expiryDate: body.expiryDate ?? null
    });
    const inventory = await prisma.inventoryItem.create({
      data: {
        vendor_id: req.user!.id,
        product_name: body.productName,
        category: body.category,
        quantity: body.quantity,
        purchase_date: body.purchaseDate,
        expiry_date: body.expiryDate ?? null,
        condition: body.condition,
        status: lifecycle.status,
        deadstock_flagged_at: lifecycle.deadstockFlaggedAt
      }
    });
    res.status(201).json({ success: true, data: mapInventory(inventory) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.get("/", async (req, res, next) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: inventoryWhereForUser(req.user!.id, req.user!.role),
      orderBy: { created_at: "desc" }
    });
    res.json({ success: true, data: inventoryItems.map(mapInventory) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.get("/aging", async (req, res, next) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: inventoryWhereForUser(req.user!.id, req.user!.role),
      orderBy: { created_at: "desc" }
    });
    res.json({ success: true, data: lifecycleItems(inventoryItems, ["AGING", "DEADSTOCK_FLAGGED"]) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.get("/deadstock", async (req, res, next) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: inventoryWhereForUser(req.user!.id, req.user!.role),
      orderBy: { created_at: "desc" }
    });
    res.json({ success: true, data: lifecycleItems(inventoryItems, ["DEADSTOCK_FLAGGED"]) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.get("/:id", async (req, res, next) => {
  try {
    const item = await prisma.inventoryItem.findFirst({
      where: { id: req.params.id, ...inventoryWhereForUser(req.user!.id, req.user!.role) }
    });
    if (!item) return res.status(404).json({ success: false, error: { message: "Inventory item not found" } });
    res.json({ success: true, data: mapInventory(item) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.patch("/:id", async (req, res, next) => {
  try {
    const body = inventoryUpdateSchema.parse(req.body);
    const existing = await prisma.inventoryItem.findFirst({
      where: { id: req.params.id, ...inventoryWhereForUser(req.user!.id, req.user!.role) }
    });
    if (!existing) return res.status(404).json({ success: false, error: { message: "Inventory item not found" } });
    if (existing.status === "SUBMITTED_FOR_VERIFICATION") {
      return res.status(409).json({ success: false, error: { message: "Submitted inventory cannot be edited" } });
    }

    const purchaseDate = body.purchaseDate ?? existing.purchase_date;
    const expiryDate = body.expiryDate === undefined ? existing.expiry_date : body.expiryDate;
    const lifecycle = evaluateInventoryLifecycle({
      purchaseDate,
      expiryDate: expiryDate ?? null,
      currentStatus: (body.status ?? existing.status) as "ACTIVE" | "AGING" | "DEADSTOCK_FLAGGED" | "SUBMITTED_FOR_VERIFICATION"
    });

    const updated = await prisma.inventoryItem.update({
      where: { id: existing.id },
      data: {
        product_name: body.productName ?? existing.product_name,
        category: body.category ?? existing.category,
        quantity: body.quantity ?? existing.quantity,
        purchase_date: purchaseDate,
        expiry_date: expiryDate ?? null,
        condition: body.condition ?? existing.condition,
        status: body.status ?? lifecycle.status,
        deadstock_flagged_at: lifecycle.deadstockFlaggedAt ?? existing.deadstock_flagged_at
      }
    });

    res.json({ success: true, data: mapInventory(updated) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.inventoryItem.findFirst({
      where: { id: req.params.id, ...inventoryWhereForUser(req.user!.id, req.user!.role) },
      select: { id: true }
    });
    if (!existing) return res.status(404).json({ success: false, error: { message: "Inventory item not found" } });
    await prisma.inventoryItem.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
