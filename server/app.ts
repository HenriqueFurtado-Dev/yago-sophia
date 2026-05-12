import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL não definida.')
  return neon(url)
}

export const app = new Hono()

app.use('*', cors({ origin: '*' }))

// ── POST /api/reservations ────────────────────────────────
app.post('/api/reservations', async c => {
  const sql = getDb()
  const body = await c.req.json<{
    gift_id: number
    gift_name: string
    guest_name: string
    amount: number
    comprovante: string
  }>()

  const { gift_id, gift_name, guest_name, amount, comprovante } = body

  if (!gift_id || !guest_name?.trim()) {
    return c.json({ error: 'gift_id e guest_name são obrigatórios' }, 400)
  }

  const existing = await sql`
    SELECT id FROM reservations
    WHERE gift_id = ${gift_id} AND status = 'confirmed'
    LIMIT 1
  `
  if (existing.length > 0) {
    return c.json({ error: 'Este presente já foi confirmado por outro convidado.' }, 409)
  }

  const rows = await sql`
    INSERT INTO reservations (gift_id, gift_name, guest_name, amount, comprovante)
    VALUES (${gift_id}, ${gift_name}, ${guest_name.trim()}, ${amount ?? null}, ${comprovante?.trim() || null})
    RETURNING *
  `
  return c.json(rows[0], 201)
})

// ── GET /api/reservations ─────────────────────────────────
app.get('/api/reservations', async c => {
  const sql = getDb()
  const rows = await sql`SELECT * FROM reservations ORDER BY created_at DESC`
  return c.json(rows)
})

// ── PATCH /api/reservations/:id ──────────────────────────
app.patch('/api/reservations/:id', async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))
  const { status } = await c.req.json<{ status: 'confirmed' | 'rejected' }>()

  if (!['confirmed', 'rejected'].includes(status)) {
    return c.json({ error: 'status deve ser "confirmed" ou "rejected"' }, 400)
  }

  const confirmedAt = status === 'confirmed' ? new Date().toISOString() : null
  const rows = await sql`
    UPDATE reservations
    SET status = ${status}, confirmed_at = ${confirmedAt}
    WHERE id = ${id}
    RETURNING *
  `

  if (rows.length === 0) return c.json({ error: 'Reserva não encontrada' }, 404)
  return c.json(rows[0])
})

// ── DELETE /api/reservations/:id ─────────────────────────
app.delete('/api/reservations/:id', async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))
  await sql`DELETE FROM reservations WHERE id = ${id}`
  return c.json({ ok: true })
})
