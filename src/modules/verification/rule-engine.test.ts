import { describe, expect, it } from "vitest";
import { runVerificationRules } from "./rule-engine.js";

const eligible = { productName: "Surplus chairs", category: "FURNITURE", quantity: 3, condition: "GOOD", inventoryStatus: "DEADSTOCK_FLAGGED", proofUrl: "https://example.com/proof.jpg" };

describe("runVerificationRules", () => {
  it("passes a complete eligible item", () => expect(runVerificationRules(eligible).status).toBe("PASS"));
  it("rejects missing proof", () => expect(runVerificationRules({ ...eligible, proofUrl: "" }).status).toBe("REJECT"));
  it("sends regulated categories to manual review", () => expect(runVerificationRules({ ...eligible, category: "MEDICAL" }).status).toBe("MANUAL_REVIEW"));
  it("rejects missing mandatory information before considering manual review", () => expect(runVerificationRules({ ...eligible, category: "MEDICAL", proofUrl: "" }).status).toBe("REJECT"));
});
