'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: string; type: ToastType; title: string; message?: string }

type Ctx = {
  show: (t: Omit<Toast, 'id'>) => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider/>')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 5000)
  }, [])

  const value = useMemo<Ctx>(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className='fixed inset-x-0 top-3 z-[1000] flex justify-center pointer-events-none'>
        <div className='w-full max-w-md space-y-2 px-3'>
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-xl shadow p-3 text-sm border
                ${
                  t.type === 'success'
                    ? 'bg-white/95 border-emerald-300'
                    : t.type === 'error'
                      ? 'bg-white/95 border-rose-300'
                      : 'bg-white/95 border-slate-300'
                }`}
            >
              <div className='font-medium'>{t.title}</div>
              {t.message && (
                <div className='opacity-80 mt-0.5'>{t.message}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  )
}
