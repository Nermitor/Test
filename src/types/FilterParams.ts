export type FilterParamsType = {
  year?: [number, number]
  pages?: [number, number]
  readers?: [number, number]
  language?: 'RU' | 'EN'
  publisher?: string
  publishers?: string[]
  languages?: Array<{ value: 'RU' | 'EN'; label: string }>
}
