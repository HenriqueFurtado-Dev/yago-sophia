import { useState, useEffect } from 'react'
import type { Gift } from '../types'

interface AddEditGiftModalProps {
  isOpen: boolean
  gift: Gift | null
  onClose: () => void
  onSave: (data: Omit<Gift, 'id' | 'reservado' | 'reservadoPor'>) => void
  onUpdate: (id: number, data: Partial<Gift>) => void
  onToast: (msg: string) => void
}

const EMPTY = { nome: '', valor: '', loja: '', emoji: '', desc: '', link: '' }

const INPUT_CLS =
  'w-full px-4 py-3 border border-gold/25 rounded-lg font-jost text-[14px] text-ink bg-cream outline-none focus:border-gold focus:bg-white transition-colors'
const LABEL_CLS = 'block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-muted mb-2'

export function AddEditGiftModal({ isOpen, gift, onClose, onSave, onUpdate, onToast }: AddEditGiftModalProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (isOpen) {
      setForm(
        gift
          ? { nome: gift.nome, valor: String(gift.valor), loja: gift.loja, emoji: gift.emoji || '', desc: gift.desc || '', link: gift.link || '' }
          : EMPTY
      )
    }
  }, [isOpen, gift])

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value })),
    }
  }

  function handleSave() {
    const nome = form.nome.trim()
    const valor = parseFloat(form.valor)
    if (!nome || isNaN(valor) || valor <= 0) {
      onToast('Preencha nome e valor válido.')
      return
    }

    const data = {
      nome,
      valor,
      loja: form.loja.trim() || 'A definir',
      emoji: form.emoji.trim() || '🎁',
      desc: form.desc.trim(),
      link: form.link.trim(),
    }

    if (gift) {
      onUpdate(gift.id, data)
      onToast('Presente atualizado! ✓')
    } else {
      onSave(data)
      onToast('Presente adicionado! 🎁')
    }
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
          <h3 className="font-playfair text-[20px] sm:text-[24px] text-brown">
            {gift ? 'Editar Presente' : 'Novo Presente'}
          </h3>
          <button
            onClick={onClose}
            className="text-muted text-[20px] leading-none p-1 hover:text-brown transition-colors bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-7 pb-8 pt-4 sm:pt-6 space-y-4">
          <div>
            <label className={LABEL_CLS}>Nome do presente</label>
            <input className={INPUT_CLS} placeholder="Ex: Jogo de jantar para 12 pessoas" {...field('nome')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Valor (R$)</label>
              <input type="number" step="0.01" className={INPUT_CLS} placeholder="0,00" {...field('valor')} />
            </div>
            <div>
              <label className={LABEL_CLS}>Loja</label>
              <input className={INPUT_CLS} placeholder="Ex: Tok&amp;Stok" {...field('loja')} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Emoji (opcional)</label>
            <input className={INPUT_CLS} placeholder="🍽️" maxLength={4} {...field('emoji')} />
          </div>

          <div>
            <label className={LABEL_CLS}>Descrição (opcional)</label>
            <input className={INPUT_CLS} placeholder="Breve descrição do presente" {...field('desc')} />
          </div>

          <div>
            <label className={LABEL_CLS}>Link do produto (opcional)</label>
            <input className={INPUT_CLS} placeholder="https://..." {...field('link')} />
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-white text-[13px] font-medium tracking-[0.06em] uppercase transition-colors active:bg-brown sm:hover:bg-brown"
          >
            Salvar Presente
          </button>
        </div>
      </div>
    </div>
  )
}
