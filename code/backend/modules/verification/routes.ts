import { Router } from "express";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { requireAuth, requireRole } from "../../types/auth.js";
import { runVerificationRules } from "./rule-engine.js";
import { uploadProof } from "./storage.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const submitSchema = z.object({ proofUrl: z.string().url().optional(), notes: z.string().max(1000).optional() });
const reviewSchema = z.object({ decision: z.enum(["APPROVE", "REJECT"]), notes: z.string().max(1000).optional() });

export const verificationRouter = Router();

verificationRouter.post("/:inventoryId/submit", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId;
    if (typeof inventoryId !== "string") return res.status(400).json({ success: false, error: { message: "Invalid inventory ID" } });
    const body = submitSchema.parse(req.body);
    const inventory = await prisma.inventoryItem.findFirst({ where: { id: inventoryId, vendor_id: req.user!.id } });
    if (!inventory) return res.status(404).json({ success: false, error: { message: "Inventory item not found" } });
    if (!body.proofUrl) return res.status(400).json({ success: false, error: { message: "proofUrl is required" } });

    const result = runVerificationRules({ productName: inventory.product_name, category: inventory.category, quantity: inventory.quantity, condition: inventory.condition, inventoryStatus: inventory.status, proofUrl: body.proofUrl });
    // PASS is the explainable rule decision; a non-regulated passing item is then
    // automatically VERIFIED, while anything ambiguous remains in manual review.
    const verificationStatus = result.status === "PASS" ? "VERIFIED" : result.status;
    const record = await prisma.verificationRecord.create({ data: { inventory_id: inventory.id, submitted_by: req.user!.id, proof_url: body.proofUrl, notes: body.notes, verification_status: verificationStatus, rule_result: { decision: result.status, checks: result.checks } as unknown as Prisma.InputJsonValue } });
    await prisma.inventoryItem.update({ where: { id: inventory.id }, data: { status: "SUBMITTED_FOR_VERIFICATION" } });
    res.status(201).json({ success: true, data: { verificationId: record.id, inventoryId: inventory.id, ruleResult: result.status, verificationStatus, checks: result.checks } });
  } catch (error) { next(error); }
});

verificationRouter.post("/:inventoryId/proof", requireAuth, requireRole("VENDOR"), upload.single("proof"), async (req, res, next) => {
  try {
    const inventoryId = req.params.inventoryId;
    if (typeof inventoryId !== "string") return res.status(400).json({ success: false, error: { message: "Invalid inventory ID" } });
    if (!req.file) return res.status(400).json({ success: false, error: { message: "A proof file is required" } });
    const inventory = await prisma.inventoryItem.findFirst({ where: { id: inventoryId, vendor_id: req.user!.id }, select: { id: true } });
    if (!inventory) return res.status(404).json({ success: false, error: { message: "Inventory item not found" } });
    res.status(201).json({ success: true, data: { proofUrl: await uploadProof(req.file, inventory.id) } });
  } catch (error) { next(error); }
});

verificationRouter.get("/admin/queue", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const records = await prisma.verificationRecord.findMany({ where: { verification_status: "MANUAL_REVIEW" }, include: { inventory: true }, orderBy: { submitted_at: "asc" } });
    res.json({ success: true, data: records });
  } catch (error) { next(error); }
});

verificationRouter.patch("/:verificationId/review", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const verificationId = req.params.verificationId;
    if (typeof verificationId !== "string") return res.status(400).json({ success: false, error: { message: "Invalid verification ID" } });
    const body = reviewSchema.parse(req.body);
    const record = await prisma.verificationRecord.findUnique({ where: { id: verificationId } });
    if (!record) return res.status(404).json({ success: false, error: { message: "Verification record not found" } });
    if (record.verification_status !== "MANUAL_REVIEW") return res.status(409).json({ success: false, error: { message: "Only manual-review records can be decided" } });
    const status = body.decision === "APPROVE" ? "VERIFIED" : "REJECT";
    const updated = await prisma.verificationRecord.update({ where: { id: record.id }, data: { verification_status: status, reviewer_id: req.user!.id, reviewed_at: new Date(), notes: body.notes ?? record.notes } });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});
