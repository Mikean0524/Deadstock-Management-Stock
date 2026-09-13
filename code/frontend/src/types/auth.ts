export type Role = 'VENDOR' | 'BUYER' | 'ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthSession {
  user: AuthUser
  token: string
}
