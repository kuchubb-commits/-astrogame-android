const STORAGE_KEY = 'astroprisma-gemini-key'
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEY) ?? ''
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim())
}

export interface NarrationContext {
  characterName: string
  originId: string
  hexId: string
  ring: string
  discoveryType: string | null
  discoveryText: string | null
  oracleResult: string
  oracleKeyword: string
  question: string
}

function buildPrompt(ctx: NarrationContext): string {
  const location = `hex ${ctx.hexId} (${ctx.ring} ring)${ctx.discoveryType ? `, ${ctx.discoveryType}` : ''}`
  const discovery = ctx.discoveryText ? `\nDiscovery context: ${ctx.discoveryText}` : ''
  const question = ctx.question ? `\nQuestion asked: "${ctx.question}"` : ''
  return `You are the narrator for ASTROPRISMA, a post-apocalyptic solo space RPG. Write exactly 2-3 sentences of atmospheric narration in second person ("You..."). Be evocative and cinematic. No dialogue. Respond in French.

Character: ${ctx.characterName} (${ctx.originId})
Location: ${location}${discovery}
Oracle: ${ctx.oracleResult} — Thème: ${ctx.oracleKeyword}${question}

Narration:`
}

export async function generateNarration(ctx: NarrationContext): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error('no-key')

  const res = await fetch(`${ENDPOINT}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(ctx) }] }],
      generationConfig: { maxOutputTokens: 250, temperature: 0.85 },
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Gemini ${res.status}: ${body}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  return text ?? 'Narration indisponible.'
}
