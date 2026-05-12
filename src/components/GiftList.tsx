import type { Gift } from '../types'
import { GiftCard } from './GiftCard'

interface GiftListProps {
  gifts: Gift[]
  onGiftClick: (gift: Gift) => void
}

export function GiftList({ gifts, onGiftClick }: GiftListProps) {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-[960px] mx-auto" id="lista">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-gold mb-3">
          Lista de Presentes
        </p>
        <h2 className="font-playfair text-[28px] sm:text-[36px] text-brown font-normal mb-4">
          Escolha algo especial
        </h2>
        <p className="font-cormorant text-[16px] sm:text-[18px] font-light italic text-muted max-w-[420px] mx-auto leading-relaxed px-4">
          Cada presente é uma forma carinhosa de fazer parte desta nova fase da nossa vida juntos.
        </p>
      </div>

      {gifts.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <div className="text-[48px] mb-4">🎁</div>
          <p className="font-cormorant text-[18px] italic">Nenhum presente cadastrado ainda.</p>
        </div>
      ) : (
        <div
          className="grid gap-4 sm:gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
        >
          {gifts.map(gift => (
            <GiftCard key={gift.id} gift={gift} onClick={() => onGiftClick(gift)} />
          ))}
        </div>
      )}
    </section>
  )
}
