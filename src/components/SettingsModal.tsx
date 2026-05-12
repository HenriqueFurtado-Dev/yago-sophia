import { useState, useEffect } from 'react'
import type { Settings } from '../types'

interface SettingsModalProps {
  isOpen: boolean
  settings: Settings
  token: string | null
  onClose: () => void
  onSave: (updates: Partial<Settings>) => void
  onChangePassword: (current: string, newPw: string) => Promise<void>
  onToast: (msg: string) => void
}

const INPUT_CLS =
  'w-full px-4 py-3 border border-gold/25 rounded-lg font-jost text-[14px] text-ink bg-cream outline-none focus:border-gold focus:bg-white transition-colors'
const LABEL_CLS = 'block text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-muted mb-2'

export function SettingsModal({
  isOpen,
  settings,
  token,
  onClose,
  onSave,
  onChangePassword,
  onToast,
}: SettingsModalProps) {
  const [form, setForm] = useState({
    nome1: settings.nome1,
    nome2: settings.nome2,
    data: settings.data,
    frase: settings.frase,
    pix: settings.pix,
    pixCode: settings.pixCode,
    pixQrUrl: settings.pixQrUrl,
  })

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm({
        nome1: settings.nome1,
        nome2: settings.nome2,
        data: settings.data,
        frase: settings.frase,
        pix: settings.pix,
        pixCode: settings.pixCode,
        pixQrUrl: settings.pixQrUrl,
      })
      setPwForm({ current: '', newPw: '', confirm: '' })
    }
  }, [isOpen, settings])

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value })),
    }
  }

  function handleSave() {
    onSave({
      nome1: form.nome1.trim() || settings.nome1,
      nome2: form.nome2.trim() || settings.nome2,
      data: form.data || settings.data,
      frase: form.frase.trim() || settings.frase,
      pix: form.pix.trim() || settings.pix,
      pixCode: form.pixCode.trim(),
      pixQrUrl: form.pixQrUrl.trim(),
    })
    onToast('Configurações salvas! ✓')
    onClose()
  }

  async function handleChangePassword() {
    if (!token) return
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      onToast('Preencha todos os campos de senha.')
      return
    }
    if (pwForm.newPw !== pwForm.confirm) {
      onToast('A confirmação não coincide com a nova senha.')
      return
    }
    if (pwForm.newPw.length < 8) {
      onToast('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    setPwLoading(true)
    try {
      await onChangePassword(pwForm.current, pwForm.newPw)
      setPwForm({ current: '', newPw: '', confirm: '' })
      onToast('Senha alterada com sucesso! ✓')
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Erro ao alterar senha.')
    } finally {
      setPwLoading(false)
    }
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
        className={`bg-white w-full sm:max-w-[480px] shadow-2xl rounded-t-[24px] sm:rounded-[20px] max-h-[92vh] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 sm:translate-y-5 scale-[0.97]'
        }`}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gold/30" />
        </div>

        <div className="flex items-start justify-between px-6 sm:px-7 pt-4 sm:pt-7 pb-0">
          <h3 className="font-playfair text-[20px] sm:text-[24px] text-brown">Configurações</h3>
          <button
            onClick={onClose}
            className="text-muted text-[20px] leading-none p-1 hover:text-brown transition-colors bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-7 pb-8 pt-4 sm:pt-6 space-y-4">
          {/* General settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Nome 1</label>
              <input className={INPUT_CLS} placeholder="Yago" {...field('nome1')} />
            </div>
            <div>
              <label className={LABEL_CLS}>Nome 2</label>
              <input className={INPUT_CLS} placeholder="Sophia" {...field('nome2')} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Data do casamento</label>
            <input type="date" className={INPUT_CLS} {...field('data')} />
          </div>

          <div>
            <label className={LABEL_CLS}>Frase / subtítulo</label>
            <input className={INPUT_CLS} placeholder="Celebrem conosco..." {...field('frase')} />
          </div>

          <div>
            <label className={LABEL_CLS}>Chave PIX</label>
            <input className={INPUT_CLS} placeholder="seu@email.com ou CPF" {...field('pix')} />
          </div>

          <div>
            <label className={LABEL_CLS}>PIX copia-e-cola (código completo)</label>
            <input
              className={INPUT_CLS}
              placeholder="00020126... (código EMV gerado pelo banco)"
              {...field('pixCode')}
            />
            <p className="text-[10px] text-muted mt-1">
              Gere no app do banco → PIX → Cobrar → Copia e Cola
            </p>
          </div>

          <div>
            <label className={LABEL_CLS}>QR Code PIX (URL da imagem)</label>
            <input
              className={INPUT_CLS}
              placeholder="https://... (suba a imagem do QR e cole o link)"
              {...field('pixQrUrl')}
            />
            {form.pixQrUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={form.pixQrUrl}
                  alt="QR Code preview"
                  className="w-24 h-24 object-contain border border-gold/25 rounded-lg p-1 bg-white"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-white text-[13px] font-medium tracking-[0.06em] uppercase transition-colors active:bg-brown sm:hover:bg-brown"
          >
            Salvar Configurações
          </button>

          {/* Password change */}
          <div className="border-t border-gold/20 pt-4 mt-2">
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted mb-3">Alterar senha</p>
            <div className="space-y-3">
              <div>
                <label className={LABEL_CLS}>Senha atual</label>
                <input
                  type="password"
                  className={INPUT_CLS}
                  placeholder="••••••••"
                  value={pwForm.current}
                  onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                  disabled={pwLoading}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Nova senha</label>
                <input
                  type="password"
                  className={INPUT_CLS}
                  placeholder="Mínimo 8 caracteres"
                  value={pwForm.newPw}
                  onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                  disabled={pwLoading}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Confirmar nova senha</label>
                <input
                  type="password"
                  className={INPUT_CLS}
                  placeholder="••••••••"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                  disabled={pwLoading}
                />
              </div>
              <button
                onClick={() => void handleChangePassword()}
                disabled={pwLoading || !token}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gold/40 text-brown text-[13px] font-medium tracking-[0.06em] uppercase transition-colors hover:bg-gold/10 disabled:opacity-50"
              >
                {pwLoading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
