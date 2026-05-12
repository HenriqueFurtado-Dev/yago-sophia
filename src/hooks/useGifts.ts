import { useState, useEffect } from 'react'
import type { Gift } from '../types'
import {
  fetchGifts as apiFetch,
  createGift as apiCreate,
  patchGift as apiPatch,
  removeGift as apiRemove,
  reserveGiftApi,
  releaseGiftApi,
} from '../api'

export function useGifts(token: string | null) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch()
      .then(setGifts)
      .catch(err => console.error('Erro ao carregar presentes:', err))
      .finally(() => setLoading(false))
  }, [])

  async function addGift(data: Omit<Gift, 'id' | 'reservado' | 'reservadoPor'>): Promise<void> {
    if (!token) throw new Error('Não autenticado')
    const created = await apiCreate(data, token)
    setGifts(prev => [...prev, created])
  }

  async function updateGift(id: number, data: Partial<Omit<Gift, 'id' | 'reservado' | 'reservadoPor'>>): Promise<void> {
    if (!token) throw new Error('Não autenticado')
    const updated = await apiPatch(id, data, token)
    setGifts(prev => prev.map(g => (g.id === id ? updated : g)))
  }

  async function deleteGift(id: number): Promise<void> {
    if (!token) throw new Error('Não autenticado')
    await apiRemove(id, token)
    setGifts(prev => prev.filter(g => g.id !== id))
  }

  async function reserveGift(id: number, reservadoPor: string): Promise<void> {
    if (!token) throw new Error('Não autenticado')
    const updated = await reserveGiftApi(id, reservadoPor, token)
    setGifts(prev => prev.map(g => (g.id === id ? updated : g)))
  }

  async function releaseGift(id: number): Promise<void> {
    if (!token) throw new Error('Não autenticado')
    const updated = await releaseGiftApi(id, token)
    setGifts(prev => prev.map(g => (g.id === id ? updated : g)))
  }

  return { gifts, loading, addGift, updateGift, deleteGift, reserveGift, releaseGift }
}
