import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={['rounded-xl border bg-white p-5 shadow-sm', className].filter(Boolean).join(' ')}>
      {title && <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>}
      {children}
    </div>
  )
}
