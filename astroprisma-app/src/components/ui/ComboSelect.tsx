import { useState, useRef, useEffect } from 'react'

interface ComboSelectProps {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  className?: string
}

function splitOption(s: string): { name: string; desc: string } {
  const idx = s.indexOf(' — ')
  if (idx === -1) return { name: s, desc: '' }
  return { name: s.slice(0, idx), desc: s.slice(idx + 3) }
}

export function ComboSelect({ value, onChange, options, placeholder, className }: ComboSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const { name: selectedName, desc: selectedDesc } = splitOption(value)

  useEffect(() => { setQuery('') }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const displayValue = open ? query : selectedName
  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <input
        value={displayValue}
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-bold text-white border-b border-slate-800 focus:border-purple-500/50 outline-none py-1 pr-10 placeholder-slate-700 transition"
      />
      {value && (
        <button
          onMouseDown={e => { e.preventDefault(); onChange(''); setQuery(''); setOpen(false) }}
          className="absolute right-5 top-2 text-red-500/60 hover:text-red-400 transition"
          tabIndex={-1}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 10 10">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      <button
        onMouseDown={() => setOpen(o => !o)}
        className="absolute right-0 top-2 text-slate-600 hover:text-purple-400 transition"
        tabIndex={-1}
      >
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 10 6">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {!open && selectedDesc && (
        <p className="text-xs text-slate-300 font-medium mt-0.5 leading-tight">{selectedDesc}</p>
      )}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 top-full left-0 mt-1 bg-[#111118] border border-slate-700 rounded shadow-xl max-h-48 overflow-y-auto min-w-full w-max">
          {filtered.map(opt => {
            const { name, desc } = splitOption(opt)
            return (
              <li
                key={opt}
                onMouseDown={() => { onChange(opt); setQuery(''); setOpen(false) }}
                className="px-3 py-2 cursor-pointer hover:bg-purple-500/20 transition"
              >
                <span className="text-sm font-bold text-white">{name}</span>
                {desc && <span className="block text-xs text-slate-300 font-medium mt-0.5">{desc}</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
