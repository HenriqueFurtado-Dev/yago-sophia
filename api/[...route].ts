import { handle } from 'hono/vercel'
import { app } from '../server/app.js'

// Edge runtime: sem Node.js, mas funciona com @neondatabase/serverless
export const config = { runtime: 'edge' }

const honoHandler = handle(app)

export default function handler(req: Request) {
	const url = new URL(req.url)

	// Alguns ambientes chegam aqui com pathname sem "/api".
	// Normalizamos para manter compatibilidade com app.basePath('/api').
	if (!url.pathname.startsWith('/api/')) {
		url.pathname = `/api${url.pathname.startsWith('/') ? '' : '/'}${url.pathname}`
	}

	const normalizedReq = new Request(url.toString(), req)
	return honoHandler(normalizedReq)
}
