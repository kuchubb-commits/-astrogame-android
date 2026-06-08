import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-lg border-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-accent border-accent-deep text-bone hover:bg-accent-deep active:bg-accent-deep',
    secondary: 'bg-transparent border-accent text-accent hover:bg-accent hover:text-bone',
    ghost:     'bg-transparent border-off-white text-off-white hover:border-bone hover:text-bone',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
