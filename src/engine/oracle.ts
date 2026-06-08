import oracleData from '../../data/oracle.json'

function d6(): number { return Math.floor(Math.random() * 6) + 1 }

type KeywordKey = 'noAnd' | 'no' | 'noBut' | 'yesBut' | 'yes' | 'yesAnd'

const RESULT_TO_KEY: Record<string, KeywordKey> = {
  'No, And': 'noAnd',
  'No':      'no',
  'No, But': 'noBut',
  'Yes, But':'yesBut',
  'Yes':     'yes',
  'Yes, And':'yesAnd',
}

export interface OracleResult {
  roll: number
  result: string
  description: string
  keyword: string
  isYes: boolean
}

export function rollOracle(): OracleResult {
  const roll = d6()
  const entry = oracleData.yesNo.find((e) => e.roll === String(roll)) ?? oracleData.yesNo[4]
  const themeRoll = d6()
  const row = oracleData.keywordsTable.rows[themeRoll - 1]
  const key = RESULT_TO_KEY[entry.result] ?? 'yes'
  const keyword = row[key as keyof typeof row] as string

  return {
    roll,
    result: entry.result,
    description: entry.description,
    keyword,
    isYes: entry.result.startsWith('Yes'),
  }
}

export const RESULT_COLOR: Record<string, string> = {
  'No, And':  '#ff603e',
  'No':       '#ff603e',
  'No, But':  '#ffbd5c',
  'Yes, But': '#ffbd5c',
  'Yes':      '#3fb87f',
  'Yes, And': '#3fb87f',
}
