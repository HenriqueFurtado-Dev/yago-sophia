import type { Gift } from '../types'

interface AdminTableProps {
  gifts: Gift[]
  onEdit: (gift: Gift) => void
  onDelete: (id: number) => void
  onRelease: (id: number) => void
}

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const TH = 'bg-brown text-cream px-3 sm:px-4 py-3.5 text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-medium text-left whitespace-nowrap'
const TD = 'px-3 sm:px-4 py-3.5 text-[13px] sm:text-[14px] text-ink align-middle border-b border-gold/25'

export function AdminTable({ gifts, onEdit, onDelete, onRelease }: AdminTableProps) {
  return (
    <div className="overflow-hidden rounded-xl shadow-[0_4px_24px_rgba(92,74,50,0.10)]">
      <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white" style={{ minWidth: '560px' }}>
        <thead>
          <tr>
            <th className={TH}>Presente</th>
            <th className={TH}>Loja</th>
            <th className={TH}>Valor</th>
            <th className={TH}>Status</th>
            <th className={TH}>Reservado por</th>
            <th className={TH}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {gifts.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted px-4 py-10 border-0">
                Nenhum presente cadastrado.
              </td>
            </tr>
          ) : (
            gifts.map(g => (
              <tr key={g.id} className="hover:bg-cream last:[&>td]:border-b-0">
                <td className={TD}>
                  <strong>{g.emoji || '🎁'} {g.nome}</strong>
                </td>
                <td className={TD}>{g.loja}</td>
                <td className={TD} style={{ whiteSpace: 'nowrap' }}>
                  R$ {fmt(g.valor)}
                </td>
                <td className={TD}>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium tracking-[0.05em] uppercase whitespace-nowrap ${
                      g.reservado ? 'bg-[#fdecea] text-[#c0392b]' : 'bg-sage-pale text-sage'
                    }`}
                  >
                    {g.reservado ? 'Reservado' : 'Disponível'}
                  </span>
                </td>
                <td className={TD}>{g.reservadoPor || '—'}</td>
                <td className={TD}>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onEdit(g)}
                      className="px-3 py-1.5 rounded-lg border border-gold text-gold text-[11px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-gold hover:text-white whitespace-nowrap"
                    >
                      Editar
                    </button>
                    {g.reservado && (
                      <button
                        onClick={() => onRelease(g.id)}
                        className="px-3 py-1.5 rounded-lg bg-gold-pale text-brown border border-gold/25 text-[11px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-gold-light hover:text-white whitespace-nowrap"
                      >
                        Liberar
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Excluir este presente?')) onDelete(g.id)
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#e74c3c] text-white text-[11px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-[#c0392b] whitespace-nowrap"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}
