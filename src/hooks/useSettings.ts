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
  senha: 'casamento2025',
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('wl_settings')
    return stored ? (JSON.parse(stored) as Settings) : DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem('wl_settings', JSON.stringify(settings))
  }, [settings])

  function updateSettings(updates: Partial<Settings>) {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  return { settings, updateSettings }
}
