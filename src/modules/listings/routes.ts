import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../types/auth.js";
import { getListingPublicationError } from "./listing-policy.js";

const prisma = new PrismaClient();
const listingSchema = z.object({ inventoryId: z.string().uuid(), title: z.string().min(3).max(120), description: z.string().min(10).max(2000), price: z.number().nonnegative(), quantity: z.number().int().positive() });
export const listingRouter = Router();

listingRouter.post("/", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const body = listingSchema.parse(req.body);
    const inventory = await prisma.inventoryItem.findFirst({ where: { id: body.inventoryId, vendor_id: req.user!.id } });
    if (!inventory) return res.status(404).json({ success: false, error: { message: "Inventory item not found" } });
    const verified = await prisma.verificationRecord.findFirst({ where: { inventory_id: inventory.id, verification_status: "VERIFIED" } });
    const publicationError = getListingPublicationError(verified?.verification_status, body.quantity, inventory.quantity);
    if (publicationError) return res.status(verified ? 400 : 409).json({ success: false, error: { message: publicationError } });
    const listing = await prisma.listing.create({ data: { inventory_id: inventory.id, vendor_id: req.user!.id, title: body.title, description: body.description, price: body.price, quantity: body.quantity, listing_status: "PUBLISHED", published_at: new Date() } });
    res.status(201).json({ success: true, data: listing });
  } catch (error) { next(error); }
});

listingRouter.get("/marketplace", async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const listings = await prisma.listing.findMany({ where: { listing_status: "PUBLISHED", ...(search ? { title: { contains: search, mode: "insensitive" } } : {}) }, include: { inventory: true }, orderBy: { published_at: "desc" } });
    res.json({ success: true, data: listings });
  } catch (error) { next(error); }
});
