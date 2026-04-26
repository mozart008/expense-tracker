import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-500',
  secondary: 'bg-slate-500 text-white hover:bg-slate-400',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2 py-1',
  md: 'px-3 py-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`rounded transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
