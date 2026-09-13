import crypto from "node:crypto";
import bcrypt from "bcryptjs";

type Row = Record<string, any>;
const id = () => crypto.randomUUID();
const now = () => new Date();
const users: Row[] = [];
const inventory: Row[] = [];
const verifications: Row[] = [];
const listings: Row[] = [];

function matches(row: Row, where: Row = {}): boolean {
  return Object.entries(where).every(([key, value]) => {
    if (value === undefined) return true;
    if (value && typeof value === "object" && "contains" in value) return String(row[key] ?? "").toLowerCase().includes(String(value.contains).toLowerCase());
    return row[key] === value;
  });
}
function select(row: Row, fields?: Row) {
  if (!fields) return { ...row };
  return Object.fromEntries(Object.keys(fields).filter((key) => fields[key]).map((key) => [key, row[key]]));
}
function table(rows: Row[], relations?: (row: Row, include?: Row) => Row) {
  return {
    async create({ data }: Row) { const row = { id: id(), created_at: now(), ...data }; rows.push(row); return { ...row }; },
    async findUnique({ where, select: fields }: Row) { const row = rows.find((item) => matches(item, where)); return row ? select(row, fields) : null; },
    async findFirst({ where, select: fields, include }: Row = {}) { const row = rows.find((item) => matches(item, where)); return row ? select(relations ? relations(row, include) : row, fields) : null; },
    async findMany({ where, select: fields, include, orderBy }: Row = {}) {
      const result = rows.filter((item) => matches(item, where)).map((item) => relations ? relations(item, include) : item);
      if (orderBy) { const [key, direction] = Object.entries(orderBy)[0] as [string, string]; result.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (direction === "desc" ? -1 : 1)); }
      return result.map((item) => select(item, fields));
    },
    async update({ where, data }: Row) { const row = rows.find((item) => matches(item, where)); if (!row) throw new Error("Record not found"); Object.assign(row, data); return { ...row }; },
    async delete({ where }: Row) { const index = rows.findIndex((item) => matches(item, where)); if (index < 0) throw new Error("Record not found"); return rows.splice(index, 1)[0]; }
  };
}

// Prisma-shaped subset used by the prototype. It deliberately resets on server restart.
export function createMemoryPrisma() {
  const vendorId = id(), buyerId = id(), adminId = id();
  users.push(
    { id: vendorId, name: "Demo Vendor", email: "vendor@example.com", password_hash: bcrypt.hashSync("Vendor123!", 12), role: "VENDOR", created_at: now() },
    { id: buyerId, name: "Demo Buyer", email: "buyer@example.com", password_hash: bcrypt.hashSync("Buyer123!", 12), role: "BUYER", created_at: now() },
    { id: adminId, name: "Demo Admin", email: "admin@example.com", password_hash: bcrypt.hashSync("Admin123!", 12), role: "ADMIN", created_at: now() }
  );
  const item = { id: id(), vendor_id: vendorId, product_name: "Surplus first-aid kits", category: "MEDICAL", quantity: 24, purchase_date: new Date(Date.now() - 90 * 86400000), expiry_date: null, condition: "GOOD", status: "SUBMITTED_FOR_VERIFICATION", created_at: now(), deadstock_flagged_at: new Date() };
  inventory.push(item);
  verifications.push({ id: id(), inventory_id: item.id, submitted_by: vendorId, proof_url: "https://placehold.co/720x420?text=Demo+proof", verification_status: "MANUAL_REVIEW", rule_result: { decision: "MANUAL_REVIEW", checks: [] }, notes: "Demo review item", reviewer_id: null, reviewed_at: null, submitted_at: now() });
  listings.push({ id: id(), inventory_id: item.id, vendor_id: vendorId, title: "Verified surplus office chairs", description: "Good-condition chairs from a closed office floor.", price: 850, quantity: 12, listing_status: "PUBLISHED", published_at: now(), created_at: now() });
  return {
    users: table(users),
    inventoryItem: table(inventory),
    verificationRecord: table(verifications, (record, include) => include?.inventory ? { ...record, inventory: { ...inventory.find((item) => item.id === record.inventory_id) } } : { ...record }),
    listing: table(listings, (listing, include) => include?.inventory ? { ...listing, inventory: { ...inventory.find((item) => item.id === listing.inventory_id) } } : { ...listing })
  };
}
