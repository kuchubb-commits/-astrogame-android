import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'inset'
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const base = 'border-2 border-astro-ink rounded-lg p-4'
  const bg = variant === 'inset'
    ? 'bg-[#1c1429]'
    : 'bg-[#1a1025]'

  return (
    <div className={`${base} ${bg} ${className}`}>
      {children}
    </div>
  )
}
