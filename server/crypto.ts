import { SignJWT, jwtVerify } from 'jose'

// ── PBKDF2-SHA256 — 200.000 iterações (padrão NIST) ──────

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))

  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    key,
    256,
  )

  const hex = (buf: ArrayBufferLike) =>
    Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')

  return `pbkdf2:${hex(salt.buffer as ArrayBufferLike)}:${hex(bits)}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(':')
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false

  const salt = new Uint8Array(parts[1].match(/.{2}/g)!.map(h => parseInt(h, 16)))
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    key,
    256,
  )

  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('')
  const stored_hash = parts[2]

  // Comparação em tempo constante (evita timing attacks)
  if (computed.length !== stored_hash.length) return false
  let diff = 0
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ stored_hash.charCodeAt(i)
  }
  return diff === 0
}

// ── JWT (HS256, 8h) ───────────────────────────────────────

function secret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET não definida.')
  return new TextEncoder().encode(s)
}

export async function createToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret())
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret())
    return true
  } catch {
    return false
  }
}
