import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  cursor?: 'pointer' | 'default'
} & ButtonHTMLAttributes<HTMLButtonElement>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-500',
  secondary: 'bg-transparent text-inherit hover:bg-slate-100',
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
  cursor = 'pointer',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`rounded transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      type={type}
      style={{ cursor }}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
