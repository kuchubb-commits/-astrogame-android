export type DiceFormula =
  | { type: 'd'; sides: 4 | 6 | 8 | 10 | 12 | 20 }
  | { type: '2d6' }
  | { type: 'd66' }
  | { type: 'dN+mod'; sides: number; mod: number }
  | { type: 'd6xStat'; stat: number }

function rand(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

export interface RollResult {
  formula: string
  rolls: number[]
  total: number
}

export function roll(formula: DiceFormula): RollResult {
  switch (formula.type) {
    case 'd': {
      const r = rand(formula.sides)
      return { formula: `d${formula.sides}`, rolls: [r], total: r }
    }
    case '2d6': {
      const a = rand(6)
      const b = rand(6)
      return { formula: '2d6', rolls: [a, b], total: a + b }
    }
    case 'd66': {
      const tens = rand(6)
      const ones = rand(6)
      return { formula: 'd66', rolls: [tens, ones], total: tens * 10 + ones }
    }
    case 'dN+mod': {
      const r = rand(formula.sides)
      return {
        formula: `d${formula.sides}+${formula.mod}`,
        rolls: [r],
        total: r + formula.mod,
      }
    }
    case 'd6xStat': {
      const r = rand(6)
      return {
        formula: `d6×${formula.stat}`,
        rolls: [r],
        total: r * formula.stat,
      }
    }
  }
}

export function rollSimple(sides: number): number {
  return rand(sides)
}
