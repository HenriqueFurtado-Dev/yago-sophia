import type { Gift } from '../types'

interface GiftCardProps {
  gift: Gift
  onClick: () => void
}

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export function GiftCard({ gift, onClick }: GiftCardProps) {
  return (
    <div
      role={gift.reservado ? undefined : 'button'}
      tabIndex={gift.reservado ? undefined : 0}
      onKeyDown={e => {
        if (!gift.reservado && (e.key === 'Enter' || e.key === ' ')) onClick()
      }}
      onClick={gift.reservado ? undefined : onClick}
      className={`bg-white border border-gold/25 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(92,74,50,0.10)] transition-all duration-300 relative select-none ${
        gift.reservado
          ? 'opacity-75'
          : 'cursor-pointer active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:shadow-[0_12px_48px_rgba(92,74,50,0.16)]'
      }`}
    >
      {/* Emoji area */}
      <div
        className="w-full flex items-center justify-center text-[44px] sm:text-[52px]"
        style={{
          height: 'clamp(140px, 40vw, 180px)',
          background: 'linear-gradient(135deg, #f2ebe0 0%, #f0e4cc 100%)',
        }}
      >
        {gift.emoji || '🎁'}
      </div>

      {/* Status badge */}
      <span
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-medium tracking-[0.05em] uppercase ${
          gift.reservado ? 'bg-[#fdecea] text-[#c0392b]' : 'bg-sage-pale text-sage'
        }`}
      >
        {gift.reservado ? 'Reservado' : 'Disponível'}
      </span>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <p className="font-playfair text-[16px] sm:text-[18px] text-brown font-normal mb-1 leading-snug">
          {gift.nome}
        </p>
        <p className="text-[11px] sm:text-[12px] text-muted tracking-[0.05em] mb-3">{gift.loja}</p>
        <p className="font-playfair text-[20px] sm:text-[22px] text-gold font-semibold mb-4">
          R$ {fmt(gift.valor)}
        </p>

        {gift.reservado ? (
          <p className="text-[12px] text-muted italic">
            💛 Presenteado por: {gift.reservadoPor}
          </p>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sage text-white text-[11px] sm:text-[12px] font-medium tracking-[0.06em] uppercase transition-colors">
            Ver e presentear
          </span>
        )}
      </div>
    </div>
  )
}
