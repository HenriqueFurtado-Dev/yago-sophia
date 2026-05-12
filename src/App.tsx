import { useState, useEffect } from 'react'
import type { Gift, ModalType } from './types'
import { useGifts } from './hooks/useGifts'
import { useSettings } from './hooks/useSettings'
import { useAdmin } from './hooks/useAdmin'
import { Hero } from './components/Hero'
import { GiftList } from './components/GiftList'
import { GiftModal } from './components/GiftModal'
import { AdminPanel } from './components/AdminPanel'
import { AddEditGiftModal } from './components/AddEditGiftModal'
import { SettingsModal } from './components/SettingsModal'
import { LoginModal } from './components/LoginModal'
import { Toast } from './components/Toast'

export function App() {
  const { gifts, addGift, updateGift, deleteGift, reserveGift, releaseGift } = useGifts()
  const { settings, updateSettings } = useSettings()
  const { isAdmin, login, logout } = useAdmin()

  const [openModal, setOpenModal] = useState<ModalType>(null)
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [editingGift, setEditingGift] = useState<Gift | null>(null)
  const [toast, setToast] = useState('')

  // Update document title whenever couple names change
  useEffect(() => {
    document.title = `Lista de Presentes — ${settings.nome1} & ${settings.nome2}`
  }, [settings.nome1, settings.nome2])

  // Scroll to admin panel after login
  useEffect(() => {
    if (!isAdmin) return
    setToast('Bem-vindo ao painel! 💛')
    const timer = setTimeout(() => {
      document.getElementById('admin-panel')?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
    return () => clearTimeout(timer)
  }, [isAdmin])

  function handleLogin(password: string): boolean {
    return login(password, settings.senha)
  }

  function handleLogout() {
    logout()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setToast('Sessão encerrada.')
  }

  function handleAdminToggle() {
    if (isAdmin) {
      document.getElementById('admin-panel')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setOpenModal('login')
    }
  }

  function openGiftModal(gift: Gift) {
    if (gift.reservado) return
    setSelectedGift(gift)
    setOpenModal('gift')
  }

  function handleOpenAdd() {
    setEditingGift(null)
    setOpenModal('add-edit')
  }

  function handleEditGift(gift: Gift) {
    setEditingGift(gift)
    setOpenModal('add-edit')
  }

  function handleDeleteGift(id: number) {
    deleteGift(id)
    setToast('Presente removido.')
  }

  function handleReleaseGift(id: number) {
    releaseGift(id)
    setToast('Presente disponível novamente.')
  }

  function closeModal() {
    setOpenModal(null)
  }

  return (
    <div className="min-h-screen bg-cream text-ink font-jost overflow-x-hidden">
      <Hero settings={settings} />

      <GiftList gifts={gifts} onGiftClick={openGiftModal} />

      <footer className="text-center px-6 py-10 border-t border-gold/25 text-[11px] sm:text-[12px] text-muted tracking-[0.1em]">
        ✦ &nbsp; Feito com amor para o nosso casamento &nbsp; ✦
      </footer>

      <AdminPanel
        gifts={gifts}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onOpenSettings={() => setOpenModal('settings')}
        onOpenAdd={handleOpenAdd}
        onEditGift={handleEditGift}
        onDeleteGift={handleDeleteGift}
        onReleaseGift={handleReleaseGift}
        onConfirmReservation={reserveGift}
        onToast={setToast}
      />

      {/* Modals */}
      <GiftModal
        gift={selectedGift}
        settings={settings}
        isOpen={openModal === 'gift'}
        onClose={closeModal}
        onReserve={(id, nome) => reserveGift(id, nome)}
        onToast={setToast}
      />

      <LoginModal
        isOpen={openModal === 'login'}
        onClose={closeModal}
        onLogin={handleLogin}
        onToast={setToast}
      />

      <SettingsModal
        isOpen={openModal === 'settings'}
        settings={settings}
        onClose={closeModal}
        onSave={updateSettings}
        onToast={setToast}
      />

      <AddEditGiftModal
        isOpen={openModal === 'add-edit'}
        gift={editingGift}
        onClose={closeModal}
        onSave={addGift}
        onUpdate={updateGift}
        onToast={setToast}
      />

      {/* Admin toggle button */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={handleAdminToggle}
          className="bg-brown text-cream rounded-[50px] px-4 sm:px-5 py-2.5 font-jost text-[11px] sm:text-[12px] tracking-[0.1em] uppercase cursor-pointer shadow-[0_4px_16px_rgba(58,46,34,0.3)] transition-colors hover:bg-ink active:bg-ink border-none"
        >
          {isAdmin ? '⚙ Painel' : '⚙ Admin'}
        </button>
      </div>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
