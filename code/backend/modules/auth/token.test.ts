import { describe, expect, it } from "vitest";
import { issueAuthToken, verifyAuthToken } from "./token.js";

describe("auth token helpers", () => {
  it("creates and verifies a signed token", () => {
    const token = issueAuthToken({ id: "user-1", role: "VENDOR" }, "secret", "1h");
    expect(verifyAuthToken(token, "secret")).toEqual({ id: "user-1", role: "VENDOR" });
  });

  it("rejects tokens signed with a different secret", () => {
    const token = issueAuthToken({ id: "user-1", role: "VENDOR" }, "secret", "1h");
    expect(() => verifyAuthToken(token, "different")).toThrow();
  });
});
