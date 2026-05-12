import { useState, useEffect } from 'react'
import type { Settings } from '../types'

const DEFAULT_SETTINGS: Settings = {
  nome1: 'Yago',
  nome2: 'Sophia',
  data: '2025-12-06',
  frase: 'Celebrem conosco este momento tão especial',
  pix: 'casamento@email.com',
  pixCode: '',
  pixQrUrl: '',
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('wl_settings')
    if (!stored) return DEFAULT_SETTINGS
    // Strip legacy `senha` field from older stored data
    const parsed = JSON.parse(stored) as Record<string, unknown>
    delete parsed['senha']
    return { ...DEFAULT_SETTINGS, ...parsed } as Settings
  })

  useEffect(() => {
    localStorage.setItem('wl_settings', JSON.stringify(settings))
  }, [settings])

  function updateSettings(updates: Partial<Settings>) {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  return { settings, updateSettings }
}
