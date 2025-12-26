import { mockResponse, booksMock } from '@/mocks'
import type { FilterParamsType } from '@/types'

const fetchFilterParams = (): Promise<FilterParamsType> => {
  const { year, pages, readers } = booksMock.reduce(
    (acc, book) => {
      acc.year.push(book.year)
      acc.pages.push(book.pages)
      acc.readers.push(book.readers)
      return acc
    },
    { year: [], pages: [], readers: [] } as { year: number[]; pages: number[]; readers: number[] },
  )

  const publishers = [...new Set(booksMock.map((book) => book.publisher))].sort()
  const languages = [
    { value: 'RU' as const, label: 'Русский' },
    { value: 'EN' as const, label: 'Английский' },
  ]

  if (year.length === 0 || pages.length === 0 || readers.length === 0) {
    console.error('No books data available')
    return mockResponse({
      year: [0, 0],
      pages: [0, 0],
      readers: [0, 0],
      publishers: [],
      languages: [],
    })
  }

  return mockResponse({
    year: [Math.min(...year), Math.max(...year)],
    pages: [Math.min(...pages), Math.max(...pages)],
    readers: [Math.min(...readers), Math.max(...readers)],
    publishers,
    languages,
  })
}

export const filtersMockApi = {
  fetchFilterParams,
}
