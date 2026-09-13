import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={['rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl', className].filter(Boolean).join(' ')}>
      {title && <h3 className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{title}</h3>}
      {children}
    </div>
  )
}
