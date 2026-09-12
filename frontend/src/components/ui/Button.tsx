import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  danger: 'border border-rose-300 text-rose-700 hover:bg-rose-50',
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button
      className={[
        'rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_CLASSES[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
