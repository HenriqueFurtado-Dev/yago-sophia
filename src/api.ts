import type { Reservation } from './types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? `Erro ${res.status}`)
  }
  return res.json() as Promise<T>
}

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

export function fetchReservations(): Promise<Reservation[]> {
  return request('/api/reservations')
}

export function updateReservation(
  id: number,
  status: 'confirmed' | 'rejected',
): Promise<Reservation> {
  return request(`/api/reservations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export function deleteReservation(id: number): Promise<void> {
  return request(`/api/reservations/${id}`, { method: 'DELETE' })
}
