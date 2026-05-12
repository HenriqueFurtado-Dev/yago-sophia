import type { Gift, Reservation } from './types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Erro ${res.status}`)
  }
  return res.json() as Promise<T>
}

function authHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

// ── Auth ─────────────────────────────────────────────────

export function login(password: string): Promise<{ token: string }> {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
}

export function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean }> {
  return request('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

// ── Gifts ─────────────────────────────────────────────────

export function fetchGifts(): Promise<Gift[]> {
  return request('/api/gifts')
}

export function createGift(
  data: Omit<Gift, 'id' | 'reservado' | 'reservadoPor'>,
  token: string,
): Promise<Gift> {
  return request('/api/gifts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(data),
  })
}

export function patchGift(
  id: number,
  data: Partial<Omit<Gift, 'id' | 'reservado' | 'reservadoPor'>>,
  token: string,
): Promise<Gift> {
  return request(`/api/gifts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(data),
  })
}

export function removeGift(id: number, token: string): Promise<void> {
  return request(`/api/gifts/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  })
}

export function reserveGiftApi(id: number, reservadoPor: string, token: string): Promise<Gift> {
  return request(`/api/gifts/${id}/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify({ reservadoPor }),
  })
}

export function releaseGiftApi(id: number, token: string): Promise<Gift> {
  return request(`/api/gifts/${id}/release`, {
    method: 'POST',
    headers: authHeader(token),
  })
}

// ── Reservations ─────────────────────────────────────────

export function createReservation(data: {
  gift_id: number
  gift_name: string
  guest_name: string
  amount: number
  comprovante: string
}): Promise<Reservation> {
  return request('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function fetchReservations(token: string): Promise<Reservation[]> {
  return request('/api/reservations', { headers: authHeader(token) })
}

export function updateReservation(
  id: number,
  status: 'confirmed' | 'rejected',
  token: string,
): Promise<Reservation> {
  return request(`/api/reservations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify({ status }),
  })
}

export function deleteReservation(id: number, token: string): Promise<void> {
  return request(`/api/reservations/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  })
}
