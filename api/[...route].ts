import { handle } from 'hono/vercel'
import { app } from '../server/app'

// Edge runtime: sem Node.js, mas funciona com @neondatabase/serverless
export const config = { runtime: 'edge' }

export default handle(app)
