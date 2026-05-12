import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Crie um arquivo .env com a connection string do Neon.')
}

export const sql = neon(process.env.DATABASE_URL)
