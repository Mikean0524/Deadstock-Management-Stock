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
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <form className="flex w-full max-w-sm flex-col gap-3 rounded-xl border bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="text-sm text-slate-600">Vendor and admin access to the deadstock portal.</p>
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
      </form>
    </div>
  )
}
