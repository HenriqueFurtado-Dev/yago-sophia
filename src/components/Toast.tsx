import { useEffect, useRef, useState } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  const [displayMsg, setDisplayMsg] = useState(message)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (message) {
      setDisplayMsg(message)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => onCloseRef.current(), 3000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [message])

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-brown text-cream px-6 py-3 rounded-lg text-[13px] z-[200] pointer-events-none whitespace-nowrap transition-all duration-300 ${
        message ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {displayMsg}
    </div>
  )
}
