import { useMemo, useState } from "react";
import type { MarketplaceListing, VerificationRecord } from "./person3-api";

const mockQueue: VerificationRecord[] = [{
  id: "verification-demo-1", inventoryId: "inventory-demo-1", productName: "Surplus first-aid kits", category: "MEDICAL",
  proofUrl: "https://placehold.co/720x420?text=Batch+proof", ruleResult: "MANUAL_REVIEW", verificationStatus: "MANUAL_REVIEW",
  checks: [
    { name: "productName", passed: true, message: "Product name is required." },
    { name: "quantity", passed: true, message: "Quantity must be greater than zero." },
    { name: "proof", passed: true, message: "A proof image or document is required." },
    { name: "regulatedCategory", passed: false, message: "Regulated categories require an administrator review." }
  ]
}];

const mockListings: MarketplaceListing[] = [{
  id: "listing-demo-1", title: "Verified surplus office chairs", description: "Good-condition chairs from a closed office floor.", price: 850, quantity: 12, verified: true
}];

function Status({ children }: { children: string }) {
  return <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">{children}</span>;
}

// Prototype-only screens: replace the mock state with person3Api calls after
// Person 1 provides the shared app shell and Person 2's API is running.
export function AdminReviewPage() {
  const [queue, setQueue] = useState(mockQueue);
  const [message, setMessage] = useState<string>();

  const decide = (id: string, decision: "APPROVE" | "REJECT") => {
    setQueue((items) => items.filter((item) => item.id !== id));
    setMessage(decision === "APPROVE" ? "Item approved and ready for verified marketplace publication." : "Item rejected.");
  };

  return <main className="mx-auto max-w-5xl space-y-6 p-6">
    <header><p className="text-sm font-medium text-indigo-600">Administrator</p><h1 className="text-3xl font-bold">Verification queue</h1></header>
    {message && <p className="rounded-md bg-slate-100 p-3 text-sm">{message}</p>}
    {queue.length === 0 ? <p className="rounded-md border p-6 text-slate-600">No verification records require manual review.</p> : queue.map((record) => <article key={record.id} className="grid gap-6 rounded-xl border bg-white p-5 shadow-sm md:grid-cols-2">
      <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{record.productName}</h2><Status>{record.ruleResult}</Status></div><p className="text-sm text-slate-600">Category: {record.category}</p><img className="aspect-video w-full rounded-lg object-cover" src={record.proofUrl} alt={`Proof for ${record.productName}`} /></section>
      <section className="space-y-3"><h3 className="font-semibold">Automated checks</h3><ul className="space-y-2 text-sm">{record.checks.map((check) => <li key={check.name} className={check.passed ? "text-emerald-700" : "text-amber-700"}>{check.passed ? "✓" : "!"} {check.message}</li>)}</ul><div className="flex gap-3 pt-4"><button onClick={() => decide(record.id, "APPROVE")} className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white">Approve</button><button onClick={() => decide(record.id, "REJECT")} className="rounded-md border border-rose-300 px-4 py-2 font-medium text-rose-700">Reject</button></div></section>
    </article>)}</main>;
}

export function BuyerMarketplacePage() {
  const [search, setSearch] = useState("");
  const listings = useMemo(() => mockListings.filter((listing) => listing.title.toLowerCase().includes(search.toLowerCase())), [search]);
  return <main className="mx-auto max-w-5xl space-y-6 p-6">
    <header><p className="text-sm font-medium text-indigo-600">Buyer</p><h1 className="text-3xl font-bold">Marketplace</h1></header>
    <input aria-label="Search listings" className="w-full rounded-md border px-3 py-2" placeholder="Search verified stock" value={search} onChange={(event) => setSearch(event.target.value)} />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{listings.map((listing) => <article key={listing.id} className="rounded-xl border bg-white p-5 shadow-sm"><Status>VERIFIED</Status><h2 className="mt-3 text-lg font-semibold">{listing.title}</h2><p className="mt-2 text-sm text-slate-600">{listing.description}</p><div className="mt-5 flex justify-between font-medium"><span>₹{listing.price}</span><span>{listing.quantity} available</span></div></article>)}</div>
    {listings.length === 0 && <p className="text-slate-600">No verified listings match your search.</p>}
  </main>;
}
