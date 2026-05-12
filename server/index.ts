import { serve } from '@hono/node-server'
import { neon } from '@neondatabase/serverless'
import { app } from './app.js'

// Cria a tabela se não existir (só no dev local)
async function initDb() {
  const sql = neon(process.env.DATABASE_URL!)
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id           SERIAL PRIMARY KEY,
      gift_id      INTEGER NOT NULL,
      gift_name    TEXT NOT NULL,
      guest_name   TEXT NOT NULL,
      amount       NUMERIC(10, 2),
      comprovante  TEXT,
      status       TEXT NOT NULL DEFAULT 'pending',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      confirmed_at TIMESTAMPTZ
    )
  `
  console.log('✓ Tabela reservations pronta')
}

initDb().catch(err => console.error('Erro ao inicializar DB:', err))

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('API rodando em http://localhost:3001')
})
