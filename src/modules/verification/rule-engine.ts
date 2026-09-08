export type VerificationResult = "PASS" | "REJECT" | "MANUAL_REVIEW";

export interface RuleCheck {
  name: "productName" | "category" | "quantity" | "condition" | "proof" | "deadstockEligibility" | "regulatedCategory";
  passed: boolean;
  message: string;
}

export interface VerificationInput {
  productName: string;
  category: string;
  quantity: number;
  condition: string;
  inventoryStatus: string;
  proofUrl: string;
}

const REGULATED_CATEGORIES = new Set(["MEDICAL", "PHARMACEUTICAL", "FOOD", "ALCOHOL", "TOBACCO"]);

export function runVerificationRules(input: VerificationInput): { status: VerificationResult; checks: RuleCheck[] } {
  const checks: RuleCheck[] = [
    { name: "productName", passed: Boolean(input.productName.trim()), message: "Product name is required." },
    { name: "category", passed: Boolean(input.category.trim()), message: "Category is required." },
    { name: "quantity", passed: input.quantity > 0, message: "Quantity must be greater than zero." },
    { name: "condition", passed: Boolean(input.condition.trim()), message: "Condition is required." },
    { name: "proof", passed: Boolean(input.proofUrl.trim()), message: "A proof image or document is required." },
    {
      name: "deadstockEligibility",
      passed: input.inventoryStatus === "DEADSTOCK_FLAGGED" || input.inventoryStatus === "SUBMITTED_FOR_VERIFICATION",
      message: "Inventory must be deadstock-flagged before verification."
    },
    {
      name: "regulatedCategory",
      passed: !REGULATED_CATEGORIES.has(input.category.trim().toUpperCase()),
      message: "Regulated categories require an administrator review."
    }
  ];

  const failedMandatory = checks.slice(0, 6).some((check) => !check.passed);
  if (failedMandatory) return { status: "REJECT", checks };
  if (!checks[6].passed) return { status: "MANUAL_REVIEW", checks };
  return { status: "PASS", checks };
}
