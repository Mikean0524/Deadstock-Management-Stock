import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../features/auth/api'
import type { LoginInput, RegisterInput } from '../features/auth/api'
import type { AuthSession, AuthUser } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'deadstock.auth'

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = readStoredSession()
    if (!stored) {
      setIsLoading(false)
      return
    }

    fetchCurrentUser(stored.token)
      .then((user) => setSession({ token: stored.token, user }))
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const value: AuthContextValue = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: session !== null,
    isLoading,
    login: async (input) => setSession(await loginUser(input)),
    register: async (input) => setSession(await registerUser(input)),
    logout: () => setSession(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
