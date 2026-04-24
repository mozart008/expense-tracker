import type { ReactNode } from 'react'

type LayoutProps = {
  title: string
  children: ReactNode
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
      {children}
    </section>
  )
}
