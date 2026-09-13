import { AddInventoryForm } from '../features/inventory/AddInventoryForm'
import { InventoryTable } from '../features/inventory/InventoryTable'
import { useCreateInventoryItem, useDeleteInventoryItem, useInventory } from '../features/inventory/hooks'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/api'

export function InventoryPage() {
  const inventory = useInventory()
  const createItem = useCreateInventoryItem()
  const deleteItem = useDeleteInventoryItem()
  const { token } = useAuth()
  const [submittingId, setSubmittingId] = useState('')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const submitForVerification = async () => {
    if (!submittingId) return
    try {
      const result = await apiRequest<{ verificationStatus: string }>(`/api/verification/${submittingId}/submit`, { method: 'POST', token: token!, body: JSON.stringify({ proofUrl: 'https://placehold.co/720x420?text=Vendor+proof', notes: 'Demo proof submitted from vendor inventory.' }) })
      setSubmissionMessage(`Submitted successfully: ${result.verificationStatus}`)
      inventory.refetch()
    } catch (error) { setSubmissionMessage(error instanceof Error ? error.message : 'Submission failed') }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-950 p-8 text-white"><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Inventory studio</p><h1 className="mt-2 text-3xl font-bold">Know what deserves a second life.</h1><p className="mt-2 max-w-xl text-indigo-100">Add, track, and verify your surplus inventory from one focused workspace.</p></section>
      <AddInventoryForm onSubmit={(item) => createItem.mutate(item)} isSubmitting={createItem.isPending} />
      {inventory.data && <section className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6"><p className="text-sm font-bold uppercase tracking-[.16em] text-indigo-600">Next step</p><h2 className="mt-1 text-xl font-bold">Submit an item for verification</h2><p className="mt-1 text-sm text-slate-600">Demo mode uses a generated proof image; no file storage is required.</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><select className="min-w-0 flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-2.5" value={submittingId} onChange={(event) => setSubmittingId(event.target.value)}><option value="">Choose inventory</option>{inventory.data.filter((item) => item.status !== 'SUBMITTED_FOR_VERIFICATION').map((item) => <option key={item.id} value={item.id}>{item.product_name}</option>)}</select><button className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-px hover:bg-indigo-700" onClick={submitForVerification}>Send for review</button></div>{submissionMessage && <p className="mt-3 rounded-xl bg-white p-3 text-sm font-medium">{submissionMessage}</p>}</section>}
      {inventory.isLoading && <p>Loading inventory...</p>}
      {inventory.isError && <p className="text-rose-700">Could not load inventory data.</p>}
      {inventory.data && (
        <InventoryTable
          items={inventory.data}
          onDelete={(id) => deleteItem.mutate(id)}
          isDeleting={deleteItem.isPending}
        />
      )}
    </div>
  )
}
