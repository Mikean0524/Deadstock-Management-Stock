import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function TextField({ label, id, className, ...rest }: TextFieldProps) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={inputId}>
      <span className="font-medium text-slate-700">{label}</span>
      <input
        id={inputId}
        className={['rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100', className].filter(Boolean).join(' ')}
        {...rest}
      />
    </label>
  )
}
