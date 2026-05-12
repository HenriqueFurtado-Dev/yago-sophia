import { useState } from 'react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (password: string) => boolean
  onToast: (msg: string) => void
}

const INPUT_CLS =
  'w-full px-4 py-3 border border-gold/25 rounded-lg font-jost text-[14px] text-ink bg-cream outline-none focus:border-gold focus:bg-white transition-colors'

export function LoginModal({ isOpen, onClose, onLogin, onToast }: LoginModalProps) {
  const [senha, setSenha] = useState('')

  function handleLogin() {
    const ok = onLogin(senha)
    if (!ok) {
      onToast('Senha incorreta. Tente novamente.')
    }
    setSenha('')
    if (ok) onClose()
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ background: 'rgba(58,46,34,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-white w-full sm:max-w-[480px] shadow-2xl rounded-t-[24px] sm:rounded-[20px] overflow-hidden transition-all duration-300 ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 sm:translate-y-5 scale-[0.97]'
        }`}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>

        <div className="flex items-start justify-between px-6 sm:px-7 pt-4 sm:pt-7 pb-0">
          <h3 className="font-playfair text-[20px] sm:text-[24px] text-brown">Área do Casal</h3>
          <button
            onClick={onClose}
            className="text-muted text-[20px] leading-none p-1 hover:text-brown transition-colors bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-7 pb-8 pt-4 sm:pt-6">
          <p className="text-muted text-[13px] sm:text-[14px] mb-5 leading-relaxed">
            Insira a senha para acessar o painel de administração.
          </p>
          <div className="mb-5">
            <label className="block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
              Senha
            </label>
            <input
              type="password"
              className={INPUT_CLS}
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-white text-[13px] font-medium tracking-[0.06em] uppercase transition-colors active:bg-brown sm:hover:bg-brown"
          >
            Entrar
          </button>
          <p className="text-[11px] text-muted text-center mt-3">
            Senha padrão: <strong>casamento2025</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
