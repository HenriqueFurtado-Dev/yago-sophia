import { useState, useEffect } from 'react'
import type { Settings } from '../types'

interface SettingsModalProps {
  isOpen: boolean
  settings: Settings
  onClose: () => void
  onSave: (updates: Partial<Settings>) => void
  onToast: (msg: string) => void
}

const INPUT_CLS =
  'w-full px-4 py-3 border border-gold/25 rounded-lg font-jost text-[14px] text-ink bg-cream outline-none focus:border-gold focus:bg-white transition-colors'
const LABEL_CLS = 'block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-muted mb-2'

export function SettingsModal({ isOpen, settings, onClose, onSave, onToast }: SettingsModalProps) {
  const [form, setForm] = useState({
    nome1: settings.nome1,
    nome2: settings.nome2,
    data: settings.data,
    frase: settings.frase,
    pix: settings.pix,
    pixCode: settings.pixCode,
    pixQrUrl: settings.pixQrUrl,
    senha: '',
  })

  useEffect(() => {
    if (isOpen) {
      setForm({
        nome1: settings.nome1,
        nome2: settings.nome2,
        data: settings.data,
        frase: settings.frase,
        pix: settings.pix,
        pixCode: settings.pixCode,
        pixQrUrl: settings.pixQrUrl,
        senha: '',
      })
    }
  }, [isOpen, settings])

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value })),
    }
  }

  function handleSave() {
    const updates: Partial<Settings> = {
      nome1: form.nome1.trim() || settings.nome1,
      nome2: form.nome2.trim() || settings.nome2,
      data: form.data || settings.data,
      frase: form.frase.trim() || settings.frase,
      pix: form.pix.trim() || settings.pix,
      pixCode: form.pixCode.trim(),
      pixQrUrl: form.pixQrUrl.trim(),
    }
    if (form.senha) updates.senha = form.senha
    onSave(updates)
    onToast('Configurações salvas! ✓')
    onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'rgba(58,46,34,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-white w-full sm:max-w-[480px] shadow-2xl rounded-t-[24px] sm:rounded-[20px] max-h-[92vh] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 sm:translate-y-5 scale-[0.97]'
        }`}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>

        <div className="flex items-start justify-between px-6 sm:px-7 pt-4 sm:pt-7 pb-0">
          <h3 className="font-playfair text-[20px] sm:text-[24px] text-brown">Configurações</h3>
          <button
            onClick={onClose}
            className="text-muted text-[20px] leading-none p-1 hover:text-brown transition-colors bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-7 pb-8 pt-4 sm:pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Nome 1</label>
              <input className={INPUT_CLS} placeholder="Yago" {...field('nome1')} />
            </div>
            <div>
              <label className={LABEL_CLS}>Nome 2</label>
              <input className={INPUT_CLS} placeholder="Sophia" {...field('nome2')} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Data do casamento</label>
            <input type="date" className={INPUT_CLS} {...field('data')} />
          </div>

          <div>
            <label className={LABEL_CLS}>Frase / subtítulo</label>
            <input className={INPUT_CLS} placeholder="Celebrem conosco..." {...field('frase')} />
          </div>

          <div>
            <label className={LABEL_CLS}>Chave PIX</label>
            <input className={INPUT_CLS} placeholder="seu@email.com ou CPF" {...field('pix')} />
          </div>

          <div>
            <label className={LABEL_CLS}>PIX copia-e-cola (código completo)</label>
            <input
              className={INPUT_CLS}
              placeholder="00020126... (código EMV gerado pelo banco)"
              {...field('pixCode')}
            />
            <p className="text-[10px] text-muted mt-1">
              Gere no app do banco → PIX → Cobrar → Copia e Cola
            </p>
          </div>

          <div>
            <label className={LABEL_CLS}>QR Code PIX (URL da imagem)</label>
            <input
              className={INPUT_CLS}
              placeholder="https://... (suba a imagem do QR e cole o link)"
              {...field('pixQrUrl')}
            />
            {form.pixQrUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={form.pixQrUrl}
                  alt="QR Code preview"
                  className="w-24 h-24 object-contain border border-gold/25 rounded-lg p-1 bg-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className={LABEL_CLS}>Nova senha (em branco = não alterar)</label>
            <input type="password" className={INPUT_CLS} placeholder="••••••••" {...field('senha')} />
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-white text-[13px] font-medium tracking-[0.06em] uppercase transition-colors active:bg-brown sm:hover:bg-brown"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  )
}
