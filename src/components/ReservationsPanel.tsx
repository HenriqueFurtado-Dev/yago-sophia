import { useState, useCallback } from 'react'
import type { Reservation } from '../types'
import { fetchReservations, updateReservation, deleteReservation } from '../api'

interface ReservationsPanelProps {
  onConfirm: (giftId: number, guestName: string) => void
  onRelease: (giftId: number) => void
  onToast: (msg: string) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmt(value: number | null) {
  if (!value) return '—'
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

const STATUS_LABEL: Record<Reservation['status'], string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  rejected: 'Rejeitado',
}

const STATUS_CLS: Record<Reservation['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-sage-pale text-sage',
  rejected: 'bg-[#fdecea] text-[#c0392b]',
}

export function ReservationsPanel({ onConfirm, onRelease, onToast }: ReservationsPanelProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchReservations()
      setReservations(data)
      setLoaded(true)
    } catch {
      onToast('Erro ao carregar reservas.')
    } finally {
      setLoading(false)
    }
  }, [onToast])

  async function handleAction(res: Reservation, status: 'confirmed' | 'rejected') {
    setActionId(res.id)
    try {
      const updated = await updateReservation(res.id, status)
      setReservations(prev => prev.map(r => (r.id === res.id ? updated : r)))
      if (status === 'confirmed') {
        onConfirm(res.gift_id, res.guest_name)
        onToast(`✓ Confirmado! ${res.gift_name} reservado por ${res.guest_name}`)
      } else {
        onRelease(res.gift_id)
        onToast(`Presente liberado novamente.`)
      }
    } catch {
      onToast('Erro ao atualizar reserva.')
    } finally {
      setActionId(null)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Remover esta reserva da lista?')) return
    setActionId(id)
    try {
      await deleteReservation(id)
      setReservations(prev => prev.filter(r => r.id !== id))
      onToast('Reserva removida.')
    } catch {
      onToast('Erro ao remover reserva.')
    } finally {
      setActionId(null)
    }
  }

  const pending = reservations.filter(r => r.status === 'pending')
  const rest = reservations.filter(r => r.status !== 'pending')

  return (
    <div className="px-4 sm:px-6 pb-16 max-w-[960px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-gold mb-1">
            Pagamentos
          </p>
          <h3 className="font-playfair text-[22px] sm:text-[28px] text-brown font-normal">
            Confirmações de Presentes
          </h3>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/40 text-brown text-[12px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-gold-pale disabled:opacity-50"
        >
          {loading ? 'Carregando...' : loaded ? '↻ Atualizar' : 'Carregar reservas'}
        </button>
      </div>

      {!loaded && !loading && (
        <p className="text-center text-muted text-[14px] py-12 font-cormorant italic text-lg">
          Clique em "Carregar reservas" para ver os pagamentos pendentes.
        </p>
      )}

      {loaded && reservations.length === 0 && (
        <p className="text-center text-muted text-[14px] py-12 font-cormorant italic text-lg">
          Nenhuma reserva registrada ainda.
        </p>
      )}

      {/* Pending reservations */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-amber-700 font-medium">
              Aguardando confirmação
            </h4>
            <span className="bg-amber-100 text-amber-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </div>
          <div className="space-y-3">
            {pending.map(r => (
              <ReservationCard
                key={r.id}
                reservation={r}
                busy={actionId === r.id}
                onConfirm={() => handleAction(r, 'confirmed')}
                onReject={() => handleAction(r, 'rejected')}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Confirmed / rejected */}
      {rest.length > 0 && (
        <div>
          <h4 className="text-[12px] tracking-[0.2em] uppercase text-muted font-medium mb-4">
            Histórico
          </h4>
          <div className="space-y-2">
            {rest.map(r => (
              <ReservationCard
                key={r.id}
                reservation={r}
                busy={actionId === r.id}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )

  function ReservationCard({
    reservation: r,
    busy,
    onConfirm: confirm,
    onReject: reject,
    onDelete: del,
  }: {
    reservation: Reservation
    busy: boolean
    onConfirm?: () => void
    onReject?: () => void
    onDelete: () => void
  }) {
    return (
      <div className="bg-white border border-gold/20 rounded-xl p-4 shadow-[0_2px_12px_rgba(92,74,50,0.07)]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-[10px] font-medium tracking-[0.05em] uppercase px-2 py-0.5 rounded-full ${STATUS_CLS[r.status]}`}
              >
                {STATUS_LABEL[r.status]}
              </span>
              <span className="text-[11px] text-muted">{formatDate(r.created_at)}</span>
            </div>
            <p className="font-playfair text-[16px] text-brown font-normal truncate">
              {r.gift_name}
            </p>
            <p className="text-[13px] text-ink mt-0.5">
              👤 {r.guest_name}
              {r.amount ? <span className="ml-2 text-gold font-medium">{fmt(r.amount)}</span> : null}
            </p>
            {r.comprovante && (
              <p className="text-[11px] text-muted mt-1 italic">Comprovante: {r.comprovante}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 items-center flex-wrap shrink-0">
            {r.status === 'pending' && confirm && reject && (
              <>
                <button
                  onClick={confirm}
                  disabled={busy}
                  className="px-3 py-1.5 rounded-lg bg-sage text-white text-[11px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-[#5e8062] disabled:opacity-50"
                >
                  ✓ Confirmar
                </button>
                <button
                  onClick={reject}
                  disabled={busy}
                  className="px-3 py-1.5 rounded-lg bg-[#e74c3c] text-white text-[11px] font-medium tracking-[0.05em] uppercase transition-colors hover:bg-[#c0392b] disabled:opacity-50"
                >
                  ✗ Rejeitar
                </button>
              </>
            )}
            <button
              onClick={del}
              disabled={busy}
              className="px-3 py-1.5 rounded-lg border border-gold/30 text-muted text-[11px] font-medium tracking-[0.05em] uppercase transition-colors hover:border-[#e74c3c] hover:text-[#e74c3c] disabled:opacity-50"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    )
  }
}
