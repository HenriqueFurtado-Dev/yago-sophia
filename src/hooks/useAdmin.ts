import { useState } from 'react'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  function login(password: string, correctPassword: string): boolean {
    if (password === correctPassword) {
      setIsAdmin(true)
      return true
    }
    return false
  }

  function logout() {
    setIsAdmin(false)
  }

  return { isAdmin, login, logout }
}
