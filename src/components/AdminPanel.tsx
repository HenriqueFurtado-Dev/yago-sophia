import type { Gift } from '../types'
import { AdminTable } from './AdminTable'

interface AdminPanelProps {
  gifts: Gift[]
  isAdmin: boolean
  onLogout: () => void
  onOpenSettings: () => void
  onOpenAdd: () => void
  onEditGift: (gift: Gift) => void
  onDeleteGift: (id: number) => void
  onReleaseGift: (id: number) => void
}

export function AdminPanel({
  gifts,
  isAdmin,
  onLogout,
  onOpenSettings,
  onOpenAdd,
  onEditGift,
  onDeleteGift,
  onReleaseGift,
}: AdminPanelProps) {
  if (!isAdmin) return null

  return (
    <div id="admin-panel">
      {/* Top bar */}
      <div className="bg-brown px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <span className="font-playfair text-cream text-[16px] sm:text-[18px]">
          Painel de Administração
        </span>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gold text-white text-[11px] sm:text-[12px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-brown-light"
          >
            ⚙ Configurações
          </button>
          <button
            onClick={onOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-sage text-white text-[11px] sm:text-[12px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-[#5e8062]"
          >
            + Novo presente
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg border border-white/40 text-white text-[11px] sm:text-[12px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Table section */}
      <div className="px-4 sm:px-6 pt-8 pb-20 max-w-[960px] mx-auto">
        <div className="text-center mb-8">
          <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-gold mb-3">
            Gerenciar
          </p>
          <h2 className="font-playfair text-[26px] sm:text-[36px] text-brown font-normal">
            Presentes Cadastrados
          </h2>
        </div>
        <AdminTable
          gifts={gifts}
          onEdit={onEditGift}
          onDelete={onDeleteGift}
          onRelease={onReleaseGift}
        />
      </div>
    </div>
  )
}
