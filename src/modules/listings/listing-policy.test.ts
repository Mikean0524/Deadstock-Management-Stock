import { describe, expect, it } from "vitest";
import { getListingPublicationError } from "./listing-policy.js";

describe("getListingPublicationError", () => {
  it("allows a verified item within its available quantity", () => {
    expect(getListingPublicationError("VERIFIED", 4, 4)).toBeUndefined();
  });

  it("does not allow a PASS record to bypass the verified publishing guard", () => {
    expect(getListingPublicationError("PASS", 1, 4)).toMatch(/VERIFIED/);
  });

  it("does not allow more stock than the inventory has", () => {
    expect(getListingPublicationError("VERIFIED", 5, 4)).toMatch(/exceeds/);
  });
});
