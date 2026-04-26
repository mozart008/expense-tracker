import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className = '', ...inputProps }: InputProps) {
  return (
    <input
      className={`w-full rounded border border-slate-300 px-2 py-1 ${className}`.trim()}
      {...inputProps}
    />
  )
}
