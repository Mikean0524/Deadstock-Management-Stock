// Drop this file into Person 1's React/Vite app. It uses the shared API shape
// and can replace mock data when the Express API is available.
export type RuleResult = "PASS" | "REJECT" | "MANUAL_REVIEW";
export type VerificationStatus = "REJECT" | "MANUAL_REVIEW" | "VERIFIED";

export interface VerificationRecord {
  id: string;
  inventoryId: string;
  productName: string;
  category: string;
  proofUrl: string;
  ruleResult: RuleResult;
  verificationStatus: VerificationStatus;
  checks: { name: string; passed: boolean; message: string }[];
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  verified: true;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function request<T>(path: string, token?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers }
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error?.message ?? "Request failed");
  return json.data;
}

export const person3Api = {
  getAdminQueue: (token: string) => request<VerificationRecord[]>("/api/verification/admin/queue", token),
  reviewVerification: (verificationId: string, decision: "APPROVE" | "REJECT", token: string) =>
    request<VerificationRecord>(`/api/verification/${verificationId}/review`, token, { method: "PATCH", body: JSON.stringify({ decision }) }),
  getMarketplace: (search = "") => request<MarketplaceListing[]>(`/api/listings/marketplace?search=${encodeURIComponent(search)}`)
};
