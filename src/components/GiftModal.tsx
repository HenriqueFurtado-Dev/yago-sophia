import { useState } from 'react'
import type { Gift, Settings } from '../types'

interface GiftModalProps {
  gift: Gift | null
  settings: Settings
  isOpen: boolean
  onClose: () => void
  onReserve: (giftId: number, nome: string) => void
  onToast: (msg: string) => void
}

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const INPUT_CLS =
  'w-full px-4 py-3 border border-gold/25 rounded-lg font-jost text-[14px] text-ink bg-cream outline-none focus:border-gold focus:bg-white transition-colors'

const BTN_COPY =
  'flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] sm:text-[12px] font-medium tracking-[0.06em] uppercase transition-colors'

export function GiftModal({ gift, settings, isOpen, onClose, onReserve, onToast }: GiftModalProps) {
  const [nome, setNome] = useState('')
  const [comprovante, setComprovante] = useState('')

  function handleConfirm() {
    if (!nome.trim()) {
      onToast('Por favor, informe seu nome 💛')
      return
    }
    if (!gift) return
    onReserve(gift.id, nome.trim())
    onToast(`Obrigado, ${nome.trim()}! Aguardando confirmação dos noivos 💛`)
    setNome('')
    setComprovante('')
    onClose()
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => onToast(`${label} copiado! ✓`))
  }

  const hasQr = Boolean(settings.pixQrUrl)
  const hasCode = Boolean(settings.pixCode)

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'rgba(58,46,34,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-white w-full sm:max-w-[480px] shadow-2xl overflow-y-auto transition-all duration-300 rounded-t-[24px] sm:rounded-[20px] max-h-[92vh] ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 sm:translate-y-5 scale-[0.97]'
        }`}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>

        <div className="flex items-start justify-between px-6 sm:px-7 pt-4 sm:pt-7 pb-0">
          <h3 className="font-playfair text-[20px] sm:text-[24px] text-brown leading-snug pr-4">
            {gift?.nome ?? ''}
          </h3>
          <button
            onClick={onClose}
            className="text-muted text-[20px] leading-none p-1 hover:text-brown transition-colors bg-transparent border-none cursor-pointer shrink-0 mt-0.5"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-7 pb-8 pt-4 sm:pt-6">
          <p className="text-muted text-[13px] sm:text-[14px] mb-4 leading-relaxed">
            {gift?.desc || `Loja: ${gift?.loja ?? ''}`}
          </p>

          {/* PIX box */}
          <div className="bg-sage-pale border border-sage/30 rounded-xl p-4 sm:p-5 text-center my-4">
            {/* Valor */}
            <p className="font-playfair text-[28px] sm:text-[32px] font-semibold text-sage">
              R$ {fmt(gift?.valor ?? 0)}
            </p>

            {/* QR Code */}
            {hasQr && (
              <div className="my-4 flex justify-center">
                <img
                  src={settings.pixQrUrl}
                  alt="QR Code PIX"
                  className="w-36 h-36 sm:w-44 sm:h-44 object-contain bg-white rounded-lg p-2 border border-sage/20"
                />
              </div>
            )}

            {/* Chave PIX + copia-e-cola */}
            <div className="mt-3 space-y-2">
              <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-sage mb-1">
                {hasCode ? 'Chave PIX ou copia-e-cola' : 'Chave PIX'}
              </p>
              <p className="font-playfair text-[15px] sm:text-[17px] text-brown font-semibold break-all">
                {settings.pix}
              </p>

              <div className={`flex gap-2 mt-3 ${hasCode ? '' : 'justify-center'}`}>
                <button
                  onClick={() => copy(settings.pix, 'Chave PIX')}
                  className={`${BTN_COPY} bg-sage text-white active:bg-[#5e8062] sm:hover:bg-[#5e8062]`}
                >
                  Copiar chave
                </button>
                {hasCode && (
                  <button
                    onClick={() => copy(settings.pixCode, 'Código PIX')}
                    className={`${BTN_COPY} bg-brown text-cream active:bg-ink sm:hover:bg-ink`}
                  >
                    Copia-e-cola
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nome */}
          <div className="mb-4">
            <label className="block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
              Seu nome (para os noivos saberem quem presenteou)
            </label>
            <input
              className={INPUT_CLS}
              placeholder="Seu nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          {/* Comprovante */}
          <div className="mb-5">
            <label className="block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
              Comprovante / observação (opcional)
            </label>
            <input
              className={INPUT_CLS}
              placeholder="Ex: últimos 4 dígitos da transação"
              value={comprovante}
              onChange={e => setComprovante(e.target.value)}
            />
          </div>

          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-white text-[13px] font-medium tracking-[0.06em] uppercase transition-colors active:bg-brown sm:hover:bg-brown"
          >
            ✓ Já fiz o PIX — registrar presente
          </button>
          <p className="text-[11px] text-muted text-center mt-3 leading-relaxed">
            Os noivos confirmarão o pagamento e seu nome aparecerá na lista 💛
          </p>
        </div>
      </div>
    </div>
  )
}
