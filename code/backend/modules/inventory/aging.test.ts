import { describe, expect, it } from "vitest";
import { evaluateInventoryLifecycle } from "./aging.js";

describe("evaluateInventoryLifecycle", () => {
  it("keeps fresh items active", () => {
    const result = evaluateInventoryLifecycle({
      purchaseDate: new Date("2026-09-01T00:00:00.000Z"),
      now: new Date("2026-09-08T00:00:00.000Z"),
      agingThresholdDays: 30,
      deadstockThresholdDays: 60
    });

    expect(result.status).toBe("ACTIVE");
  });

  it("marks older items as aging", () => {
    const result = evaluateInventoryLifecycle({
      purchaseDate: new Date("2026-07-15T00:00:00.000Z"),
      now: new Date("2026-09-08T00:00:00.000Z"),
      agingThresholdDays: 30,
      deadstockThresholdDays: 60
    });

    expect(result.status).toBe("AGING");
  });

  it("flags expired items as deadstock", () => {
    const result = evaluateInventoryLifecycle({
      purchaseDate: new Date("2026-06-01T00:00:00.000Z"),
      expiryDate: new Date("2026-09-01T00:00:00.000Z"),
      now: new Date("2026-09-08T00:00:00.000Z"),
      agingThresholdDays: 30,
      deadstockThresholdDays: 60
    });

    expect(result.status).toBe("DEADSTOCK_FLAGGED");
  });
});
