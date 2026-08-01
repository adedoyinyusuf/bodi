// Simple admin authentication using password check
// Configurable via NEXT_PUBLIC_ADMIN_PASSWORD environment variable

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export function verifyAdminPassword(password: string): boolean {
  // In production, compare hashed passwords using bcrypt
  return password === ADMIN_PASSWORD
}

export function setAdminToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('admin_token', token)
  }
}

export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('admin_token')
  }
  return null
}

export function clearAdminToken(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin_token')
  }
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminToken()
  return token === 'authenticated'
}
