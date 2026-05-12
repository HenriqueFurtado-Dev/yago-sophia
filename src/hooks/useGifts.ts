import { useState, useEffect } from 'react'
import type { Gift } from '../types'

const DEFAULT_GIFTS: Gift[] = [
  { id: 1, nome: 'Jogo de jantar completo', loja: 'Tok&Stok', valor: 480, emoji: '🍽️', desc: 'Para 12 pessoas, porcelana branca', link: '', reservado: false, reservadoPor: '' },
  { id: 2, nome: 'Panela de pressão elétrica', loja: 'Tramontina', valor: 320, emoji: '🍲', desc: 'Inox 6L, ideal para o dia a dia', link: '', reservado: false, reservadoPor: '' },
  { id: 3, nome: 'Jogo de cama king', loja: 'Trousseau', valor: 650, emoji: '🛏️', desc: 'Algodão egípcio 300 fios, king size', link: '', reservado: true, reservadoPor: 'Família Silva' },
  { id: 4, nome: 'Batedeira planetária', loja: 'KitchenAid', valor: 1200, emoji: '🎂', desc: 'Cor: cinza, 4,8L', link: '', reservado: false, reservadoPor: '' },
  { id: 5, nome: 'Vinho para a viagem', loja: 'Decanter', valor: 180, emoji: '🍷', desc: 'Sugestão: Chateau Margaux ou similar', link: '', reservado: false, reservadoPor: '' },
]

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>(() => {
    const stored = localStorage.getItem('wl_gifts')
    return stored ? (JSON.parse(stored) as Gift[]) : DEFAULT_GIFTS
  })

  useEffect(() => {
    localStorage.setItem('wl_gifts', JSON.stringify(gifts))
  }, [gifts])

  function addGift(data: Omit<Gift, 'id' | 'reservado' | 'reservadoPor'>) {
    setGifts(prev => {
      const newId = prev.length ? Math.max(...prev.map(g => g.id)) + 1 : 1
      return [...prev, { id: newId, ...data, reservado: false, reservadoPor: '' }]
    })
  }

  function updateGift(id: number, data: Partial<Gift>) {
    setGifts(prev => prev.map(g => (g.id === id ? { ...g, ...data } : g)))
  }

  function deleteGift(id: number) {
    setGifts(prev => prev.filter(g => g.id !== id))
  }

  function reserveGift(id: number, reservadoPor: string) {
    updateGift(id, { reservado: true, reservadoPor })
  }

  function releaseGift(id: number) {
    updateGift(id, { reservado: false, reservadoPor: '' })
  }

  return { gifts, addGift, updateGift, deleteGift, reserveGift, releaseGift }
}
