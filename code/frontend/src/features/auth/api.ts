import { apiRequest } from '../../lib/api'
import type { AuthSession } from '../../types/auth'

export type RegisterableRole = 'VENDOR' | 'BUYER'

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: RegisterableRole
}

export interface LoginInput {
  email: string
  password: string
}

export function registerUser(input: RegisterInput): Promise<AuthSession> {
  return apiRequest<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function loginUser(input: LoginInput): Promise<AuthSession> {
  return apiRequest<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function fetchCurrentUser(token: string): Promise<AuthSession['user']> {
  return apiRequest('/api/auth/me', { token })
}
