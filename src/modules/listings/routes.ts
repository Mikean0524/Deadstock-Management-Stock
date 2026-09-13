import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { requireAuth, requireRole } from "../../types/auth.js";
import { getListingPublicationError } from "./listing-policy.js";

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

// Prototype-only buyer action. It intentionally does not take payment or reduce stock;
// a later production phase can replace this with orders/reservations persisted in Prisma.
listingRouter.post("/:listingId/reserve", requireAuth, requireRole("BUYER"), async (req, res, next) => {
  try {
    const listingId = req.params.listingId;
    if (typeof listingId !== "string") return res.status(400).json({ success: false, error: { message: "Invalid listing ID" } });
    const listing = await prisma.listing.findFirst({ where: { id: listingId, listing_status: "PUBLISHED" } });
    if (!listing) return res.status(404).json({ success: false, error: { message: "Published listing not found" } });
    res.status(201).json({ success: true, data: { listingId, buyerId: req.user!.id, message: "Interest recorded. The vendor will be contacted in the next stage." } });
  } catch (error) { next(error); }
});
