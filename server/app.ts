import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'
import type { Context, Next } from 'hono'
import { hashPassword, verifyPassword, createToken, verifyToken } from './crypto.js'

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL não definida.')
  return neon(url)
}

function rowToGift(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    nome: row.nome as string,
    loja: (row.loja as string) || '',
    valor: Number(row.valor),
    emoji: (row.emoji as string) || '🎁',
    desc: (row.descricao as string) || '',
    link: (row.link as string) || '',
    reservado: row.reservado as boolean,
    reservadoPor: (row.reservado_por as string) || '',
  }
}

// basePath('/api') so routes work both locally (localhost:3001/api/...)
// and on Vercel (api/[...route].ts receives the full /api/... URL)
export const app = new Hono().basePath('/api')

app.use('*', cors({ origin: '*' }))

// ── Auth middleware ───────────────────────────────────────
async function requireAuth(c: Context, next: Next) {
  const auth = c.req.header('Authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token || !(await verifyToken(token))) {
    return c.json({ error: 'Não autorizado.' }, 401)
  }
  await next()
}

// ── POST /auth/login ──────────────────────────────────────
app.post('/auth/login', async c => {
  const { password } = await c.req.json<{ password: string }>()
  if (!password) return c.json({ error: 'Senha obrigatória.' }, 400)

  const sql = getDb()
  const rows = await sql`SELECT password_hash FROM admin_config WHERE id = 1`

  let valid = false
  if (rows.length === 0) {
    const initial = process.env.ADMIN_INITIAL_PASSWORD
    if (!initial) return c.json({ error: 'Servidor não configurado. Defina ADMIN_INITIAL_PASSWORD.' }, 500)
    if (password === initial) {
      const hash = await hashPassword(password)
      await sql`INSERT INTO admin_config (id, password_hash) VALUES (1, ${hash})`
      valid = true
    }
  } else {
    valid = await verifyPassword(password, rows[0].password_hash as string)
  }

  if (!valid) return c.json({ error: 'Senha incorreta.' }, 401)

  const token = await createToken()
  return c.json({ token })
})

// ── POST /auth/change-password ────────────────────────────
app.post('/auth/change-password', requireAuth, async c => {
  const { currentPassword, newPassword } = await c.req.json<{
    currentPassword: string
    newPassword: string
  }>()

  if (!currentPassword || !newPassword) return c.json({ error: 'Campos obrigatórios.' }, 400)
  if (newPassword.length < 8) return c.json({ error: 'A nova senha deve ter pelo menos 8 caracteres.' }, 400)

  const sql = getDb()
  const rows = await sql`SELECT password_hash FROM admin_config WHERE id = 1`
  if (rows.length === 0) return c.json({ error: 'Nenhuma senha configurada.' }, 500)

  const valid = await verifyPassword(currentPassword, rows[0].password_hash as string)
  if (!valid) return c.json({ error: 'Senha atual incorreta.' }, 401)

  const newHash = await hashPassword(newPassword)
  await sql`UPDATE admin_config SET password_hash = ${newHash}, updated_at = NOW() WHERE id = 1`
  return c.json({ ok: true })
})

// ── GET /gifts (público) ──────────────────────────────────
app.get('/gifts', async c => {
  const sql = getDb()
  const rows = await sql`SELECT * FROM gifts ORDER BY id ASC`
  return c.json(rows.map(r => rowToGift(r as Record<string, unknown>)))
})

// ── POST /gifts (admin) ───────────────────────────────────
app.post('/gifts', requireAuth, async c => {
  const sql = getDb()
  const { nome, loja, valor, emoji, desc, link } = await c.req.json<{
    nome: string; loja: string; valor: number; emoji: string; desc: string; link: string
  }>()

  if (!nome?.trim()) return c.json({ error: 'Nome é obrigatório.' }, 400)

  const rows = await sql`
    INSERT INTO gifts (nome, loja, valor, emoji, descricao, link)
    VALUES (${nome.trim()}, ${loja || ''}, ${valor ?? 0}, ${emoji || '🎁'}, ${desc || ''}, ${link || ''})
    RETURNING *
  `
  return c.json(rowToGift(rows[0] as Record<string, unknown>), 201)
})

// ── PATCH /gifts/:id (admin) ──────────────────────────────
app.patch('/gifts/:id', requireAuth, async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))
  const { nome, loja, valor, emoji, desc, link } = await c.req.json<{
    nome: string; loja: string; valor: number; emoji: string; desc: string; link: string
  }>()

  const rows = await sql`
    UPDATE gifts
    SET nome = ${nome}, loja = ${loja}, valor = ${valor},
        emoji = ${emoji}, descricao = ${desc}, link = ${link}
    WHERE id = ${id}
    RETURNING *
  `
  if (rows.length === 0) return c.json({ error: 'Presente não encontrado.' }, 404)
  return c.json(rowToGift(rows[0] as Record<string, unknown>))
})

// ── DELETE /gifts/:id (admin) ─────────────────────────────
app.delete('/gifts/:id', requireAuth, async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))
  await sql`DELETE FROM gifts WHERE id = ${id}`
  return c.json({ ok: true })
})

// ── POST /gifts/:id/reserve (admin) ──────────────────────
app.post('/gifts/:id/reserve', requireAuth, async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))
  const { reservadoPor } = await c.req.json<{ reservadoPor: string }>()

  const rows = await sql`
    UPDATE gifts SET reservado = true, reservado_por = ${reservadoPor || ''}
    WHERE id = ${id}
    RETURNING *
  `
  if (rows.length === 0) return c.json({ error: 'Presente não encontrado.' }, 404)
  return c.json(rowToGift(rows[0] as Record<string, unknown>))
})

// ── POST /gifts/:id/release (admin) ──────────────────────
app.post('/gifts/:id/release', requireAuth, async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))

  const rows = await sql`
    UPDATE gifts SET reservado = false, reservado_por = ''
    WHERE id = ${id}
    RETURNING *
  `
  if (rows.length === 0) return c.json({ error: 'Presente não encontrado.' }, 404)
  return c.json(rowToGift(rows[0] as Record<string, unknown>))
})

// ── POST /reservations (público — convidados) ─────────────
app.post('/reservations', async c => {
  const sql = getDb()
  const { gift_id, gift_name, guest_name, amount, comprovante } = await c.req.json<{
    gift_id: number; gift_name: string; guest_name: string; amount: number; comprovante: string
  }>()

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

// ── GET /reservations (admin) ─────────────────────────────
app.get('/reservations', requireAuth, async c => {
  const sql = getDb()
  const rows = await sql`SELECT * FROM reservations ORDER BY created_at DESC`
  return c.json(rows)
})

// ── PATCH /reservations/:id (admin) ──────────────────────
app.patch('/reservations/:id', requireAuth, async c => {
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

// ── DELETE /reservations/:id (admin) ─────────────────────
app.delete('/reservations/:id', requireAuth, async c => {
  const sql = getDb()
  const id = Number(c.req.param('id'))
  await sql`DELETE FROM reservations WHERE id = ${id}`
  return c.json({ ok: true })
})
