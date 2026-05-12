import { serve } from '@hono/node-server'
import { neon } from '@neondatabase/serverless'
import { app } from './app.js'

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

  await sql`
    CREATE TABLE IF NOT EXISTS admin_config (
      id            INTEGER PRIMARY KEY DEFAULT 1,
      password_hash TEXT NOT NULL,
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT single_row CHECK (id = 1)
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS gifts (
      id            SERIAL PRIMARY KEY,
      nome          TEXT NOT NULL,
      loja          TEXT NOT NULL DEFAULT '',
      valor         NUMERIC(10, 2) NOT NULL DEFAULT 0,
      emoji         TEXT NOT NULL DEFAULT '🎁',
      descricao     TEXT NOT NULL DEFAULT '',
      link          TEXT NOT NULL DEFAULT '',
      reservado     BOOLEAN NOT NULL DEFAULT false,
      reservado_por TEXT NOT NULL DEFAULT '',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  // Seed presentes iniciais apenas se a tabela estiver vazia
  const count = await sql`SELECT COUNT(*) AS n FROM gifts`
  if (Number(count[0].n) === 0) {
    await sql`
      INSERT INTO gifts (nome, loja, valor, emoji, descricao, link) VALUES
      ('Jogo de jantar completo',    'Tok&Stok',   480,  '🍽️', 'Para 12 pessoas, porcelana branca',             ''),
      ('Panela de pressão elétrica', 'Tramontina',  320,  '🍲', 'Inox 6L, ideal para o dia a dia',               ''),
      ('Jogo de cama king',          'Trousseau',   650,  '🛏️', 'Algodão egípcio 300 fios, king size',           ''),
      ('Batedeira planetária',       'KitchenAid', 1200, '🎂', 'Cor: cinza, 4,8L',                               ''),
      ('Vinho para a viagem',        'Decanter',    180,  '🍷', 'Sugestão: Chateau Margaux ou similar',           '')
    `
    console.log('✓ Presentes iniciais cadastrados')
  }

  console.log('✓ Tabelas prontas')
}

initDb().catch(err => console.error('Erro ao inicializar DB:', err))

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('API rodando em http://localhost:3001')
})
