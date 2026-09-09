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
        className={['rounded-md border border-slate-300 px-3 py-2 text-sm', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </select>
    </label>
  )
}
