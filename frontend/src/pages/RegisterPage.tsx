import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { TextField } from '../components/ui/TextField'
import { ApiError } from '../lib/api'
import type { RegisterableRole } from '../features/auth/api'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = { name: '', email: '', password: '', role: 'VENDOR' as RegisterableRole }

export function RegisterPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(undefined)
    setIsSubmitting(true)
    try {
      const user = await register(form)
      navigate(user.role === 'BUYER' ? '/marketplace' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell flex min-h-svh items-center justify-center p-6">
      <form className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/60 bg-white/95 p-8 shadow-2xl shadow-slate-950/15 sm:p-10" onSubmit={handleSubmit}>
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">Get started</p><h1 className="text-3xl font-bold text-slate-950">Create your account</h1>
        {error && <p className="rounded-md bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
        <TextField
          label="Full name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <TextField
          label="Password"
          type="password"
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />
        <Select
          label="I am a"
          value={form.role}
          onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as RegisterableRole }))}
        >
          <option value="VENDOR">Vendor</option>
          <option value="BUYER">Buyer</option>
        </Select>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-indigo-600" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
