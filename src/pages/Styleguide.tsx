import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatBlock from '../components/ui/StatBlock'
import DiceButton from '../components/ui/DiceButton'
import ResourceBar from '../components/ui/ResourceBar'
import Badge from '../components/ui/Badge'

const PALETTE = [
  { name: 'Indigo Black',  hex: '#130d1c', cls: 'bg-astro-black',   text: 'text-bone' },
  { name: 'Bone White',    hex: '#f0eee8', cls: 'bg-bone',          text: 'text-astro-black' },
  { name: 'Off-White',     hex: '#e0dfdb', cls: 'bg-off-white',     text: 'text-astro-black' },
  { name: 'Accent',        hex: '#ef476e', cls: 'bg-accent',        text: 'text-bone' },
  { name: 'Accent Deep',   hex: '#d50059', cls: 'bg-accent-deep',   text: 'text-bone' },
  { name: 'Yellow',        hex: '#ffbd5c', cls: 'bg-astro-yellow',  text: 'text-astro-black' },
  { name: 'Orange',        hex: '#ff603e', cls: 'bg-astro-orange',  text: 'text-bone' },
  { name: 'Indigo',        hex: '#5b2d8e', cls: 'bg-astro-indigo',  text: 'text-bone' },
  { name: 'Medusa Green',  hex: '#3fb87f', cls: 'bg-medusa',        text: 'text-astro-black' },
  { name: 'Wire Teal',     hex: '#2fa3a3', cls: 'bg-wire',          text: 'text-astro-black' },
  { name: 'Intersolar',    hex: '#3b6fd4', cls: 'bg-intersolar',    text: 'text-bone' },
  { name: 'Synth Arch',    hex: '#9b6dff', cls: 'bg-synth',         text: 'text-bone' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl text-accent uppercase tracking-widest mb-6 border-b-2 border-astro-ink pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function Styleguide() {
  return (
    <div className="min-h-screen bg-astro-black px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl text-bone uppercase tracking-wider mb-1">
          Astroprisma
        </h1>
        <p className="font-serif italic text-off-white text-lg">Design System</p>
        {/* Gradient signature */}
        <div className="mt-4 flex gap-1 justify-center">
          {['bg-astro-yellow','bg-astro-orange','bg-astro-magenta','bg-astro-indigo'].map((c, i) => (
            <div key={i} className={`${c} h-2 w-12 rounded-full`} />
          ))}
        </div>
      </div>

      {/* Palette */}
      <Section title="Palette">
        <div className="grid grid-cols-3 gap-3">
          {PALETTE.map(({ name, hex, cls, text }) => (
            <div key={hex} className={`${cls} border-2 border-astro-ink rounded-lg p-3`}>
              <span className={`font-mono text-[10px] font-bold uppercase ${text}`}>{name}</span>
              <br />
              <span className={`font-mono text-[10px] ${text} opacity-70`}>{hex}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Typographie */}
      <Section title="Typographie">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[10px] text-off-white uppercase tracking-widest mb-1">Display — Anton</p>
            <p className="font-display text-4xl text-bone">ASTROPRISMA</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-off-white uppercase tracking-widest mb-1">Corps — Space Mono</p>
            <p className="font-mono text-base text-bone">The galaxy awaits, Spaceborne.</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-off-white uppercase tracking-widest mb-1">Italique — Instrument Serif</p>
            <p className="font-serif italic text-off-white text-lg">Outer Ring · Sector 7</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-off-white uppercase tracking-widest mb-1">Labels</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-off-white">VIGOR · GRACE · MIND · TECH</p>
          </div>
        </div>
      </Section>

      {/* Card */}
      <Section title="Card">
        <div className="space-y-3">
          <Card>
            <p className="font-mono text-sm text-bone">Card default — fond légèrement éclairci, bordure noire 2px</p>
          </Card>
          <Card variant="inset">
            <p className="font-mono text-sm text-bone">Card inset — fond plus foncé pour les sections imbriquées</p>
          </Card>
        </div>
      </Section>

      {/* Button */}
      <Section title="Button">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>Désactivé</Button>
        </div>
      </Section>

      {/* StatBlock */}
      <Section title="StatBlock">
        <div className="flex gap-3 flex-wrap">
          <StatBlock label="VIGOR" value={4} />
          <StatBlock label="GRACE" value={3} />
          <StatBlock label="MIND" value={5} accent />
          <StatBlock label="TECH" value={2} />
          <StatBlock label="HP" value={12} />
          <StatBlock label="ARMOR" value={2} />
        </div>
      </Section>

      {/* DiceButton */}
      <Section title="DiceButton">
        <div className="flex flex-wrap gap-3">
          {([4, 6, 8, 10, 12, 20, '2d6', 'd66'] as const).map(s => (
            <DiceButton key={String(s)} sides={s} />
          ))}
        </div>
        <p className="font-mono text-[10px] text-off-white mt-3">Clique pour lancer — le résultat s'affiche dans le bouton.</p>
      </Section>

      {/* ResourceBar */}
      <Section title="ResourceBar">
        <div className="space-y-4">
          <ResourceBar label="Health" value={14} max={18} />
          <ResourceBar label="Energy" value={7} max={12} />
          <ResourceBar label="Fuel" value={2} max={10} />
          <ResourceBar label="Hull" value={20} max={20} />
        </div>
      </Section>

      {/* Badge */}
      <Section title="Badge de faction">
        <div className="flex flex-wrap gap-3">
          <Badge faction="warg" />
          <Badge faction="medusa" />
          <Badge faction="wire" />
          <Badge faction="intersolar" />
          <Badge faction="synth" />
        </div>
      </Section>

      {/* États */}
      <Section title="États de couleur">
        <div className="flex flex-wrap gap-2">
          <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-medusa text-astro-black border-2 border-astro-ink">Succès</span>
          <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-astro-yellow text-astro-black border-2 border-astro-ink">Avertissement</span>
          <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-astro-orange text-bone border-2 border-astro-ink">Danger</span>
          <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-accent text-bone border-2 border-astro-ink">Actif</span>
          <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-off-white text-astro-black border-2 border-astro-ink opacity-40">Inactif</span>
        </div>
      </Section>
    </div>
  )
}
