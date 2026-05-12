export interface Gift {
  id: number
  nome: string
  loja: string
  valor: number
  emoji: string
  desc: string
  link: string
  reservado: boolean
  reservadoPor: string
}

export interface Settings {
  nome1: string
  nome2: string
  data: string
  frase: string
  pix: string
  pixCode: string   // código copia-e-cola (EMV)
  pixQrUrl: string  // URL da imagem do QR Code
  senha: string
}

export interface Reservation {
  id: number
  gift_id: number
  gift_name: string
  guest_name: string
  amount: number | null
  comprovante: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
  confirmed_at: string | null
}

export type ModalType = 'gift' | 'add-edit' | 'login' | 'settings' | null
