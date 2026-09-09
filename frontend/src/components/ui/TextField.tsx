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
        className={['rounded-md border border-slate-300 px-3 py-2 text-sm', className].filter(Boolean).join(' ')}
        {...rest}
      />
    </label>
  )
}
