import { useState } from 'react'
import { login as apiLogin } from '../api'

const TOKEN_KEY = 'wl_admin_token'

function tokenIsAlive(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function useAdmin() {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    return stored && tokenIsAlive(stored) ? stored : null
  })

  const isAdmin = token !== null

  async function login(password: string): Promise<boolean> {
    try {
      const { token: newToken } = await apiLogin(password)
      localStorage.setItem(TOKEN_KEY, newToken)
      setToken(newToken)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return { isAdmin, token, login, logout }
}
