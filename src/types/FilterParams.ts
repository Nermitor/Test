export type FilterParams = {
  year?: [number, number]
  pages?: [number, number]
  readers?: [number, number]
  language?: 'RU' | 'EN'
  publisher?: string
  publishers?: string[]
  languages?: Array<{ value: 'RU' | 'EN'; label: string }>
}
