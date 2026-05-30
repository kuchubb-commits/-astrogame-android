import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function testGemini(): Promise<string> {
  const result = await model.generateContent('Dis bonjour en tant que narrateur SF épique en 1 phrase.')
  return result.response.text()
}

export { model, genAI }
