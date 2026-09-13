import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function Select({ label, id, className, children, ...rest }: SelectProps) {
  const selectId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={selectId}>
      <span className="font-medium text-slate-700">{label}</span>
      <select
        id={selectId}
        className={['rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </select>
    </label>
  )
}
