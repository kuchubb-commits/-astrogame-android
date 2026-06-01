import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash-8b' }) ?? null

export const geminiAvailable = !!model

export interface NarrativeContext {
  characterName: string
  action: string        // ex: "attaque avec Blaster"
  outcome: string       // ex: "12 dégâts infligés" | "fuite réussie" | "Oracle: Freedom"
  enemyName?: string
  mood?: 'neutre' | 'tendu' | 'épique'
}

export async function narrateAction(ctx: NarrativeContext): Promise<string> {
  if (!model) throw new Error('Clé VITE_GEMINI_API_KEY manquante.')

  const moodMap = {
    neutre: 'ton neutre, factuel, SF',
    tendu: 'ton tendu, suspense, SF cyberpunk',
    épique: 'ton épique, cinématographique, SF space opera',
  }
  const mood = moodMap[ctx.mood ?? 'tendu']

  const prompt = `Tu es le narrateur d'un jeu de rôle SF intitulé Astroprisma.
Décris l'action suivante en 2 phrases maximum, ${mood}.
Ne mentionne pas de règles ou de chiffres. Ne demande pas de suite.

Personnage : ${ctx.characterName}
Action : ${ctx.action}
Résultat : ${ctx.outcome}${ctx.enemyName ? `\nAdversaire : ${ctx.enemyName}` : ''}

Narration :`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function narrateOracle(word: string, characterName: string): Promise<string> {
  if (!model) throw new Error('Clé VITE_GEMINI_API_KEY manquante.')

  const prompt = `Tu es le narrateur d'un jeu de rôle SF intitulé Astroprisma.
L'Oracle a révélé le mot : "${word}".
Décris en 2 phrases une situation ou atmosphère liée à ce mot pour le personnage ${characterName}.
Ton SF, mystérieux, sans règles ni chiffres.

Narration :`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
