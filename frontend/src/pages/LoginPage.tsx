import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/ui/TextField'
import { ApiError } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(undefined)
    setIsSubmitting(true)
    try {
      const user = await login({ email, password })
      navigate(user.role === 'BUYER' ? '/marketplace' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell flex min-h-svh items-center justify-center p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl shadow-slate-950/30 md:grid-cols-[1.05fr_.95fr]">
      <aside className="hidden bg-slate-950 p-10 text-white md:block"><div className="grid h-full content-between"><div><div className="mb-10 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-2xl text-slate-950">◈</div><p className="text-sm font-semibold uppercase tracking-[.24em] text-cyan-300">Circular commerce</p><h1 className="mt-4 text-4xl font-bold leading-tight">Turn dormant stock into fresh opportunity.</h1><p className="mt-5 max-w-sm text-slate-300">Track inventory, verify surplus, and unlock a more sustainable marketplace.</p></div><p className="text-sm text-slate-400">One prototype. Three perspectives.</p></div></aside>
      <form className="flex w-full flex-col gap-4 p-8 sm:p-12" onSubmit={handleSubmit}>
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-indigo-600">Welcome back</p><h1 className="text-3xl font-bold text-slate-950">Sign in to Deadstock</h1>
        <p className="text-sm text-slate-600">Use a vendor, admin, or buyer demo account.</p>
        {error && <p className="rounded-md bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
        <p className="text-sm text-slate-600">
          Need an account?{' '}
          <Link className="font-medium text-indigo-600" to="/register">
            Register
          </Link>
        </p>
      </form></div>
    </div>
  )
}
