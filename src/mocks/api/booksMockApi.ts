import { mockResponse, booksMock } from '@/mocks'
import type { BookCardType, FilterParamsType } from '@/types'

export type PayloadType = {
  sort: string
  search: string
  page: number
  limit: number
  filters?: FilterParamsType
}

const fetchBooks = (payload: PayloadType) => {
  if (!payload.sort || !payload.sort.includes('_')) {
    console.error('Invalid sort parameter:', payload.sort)
    return mockResponse({ books: [], total: 0 })
  }
  const [field, dir] = payload.sort.split('_') as [keyof BookCardType, string]

  const searchLower = payload.search?.toLowerCase()
  const filteredBooks = booksMock.filter((book) => {
    if (searchLower) {
      const matchesSearch =
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower) ||
        book.title.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    if (!payload.filters) return true

    const { year, pages, readers, language, publisher } = payload.filters

    if (year && (book.year < year[0] || book.year > year[1])) return false
    if (pages && (book.pages < pages[0] || book.pages > pages[1])) return false
    if (readers && (book.readers < readers[0] || book.readers > readers[1])) return false
    if (language && book.language !== language) return false
    return !(publisher && !book.publisher.toLowerCase().includes(publisher.toLowerCase()))
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]

    const result =
      typeof aValue === 'string' && typeof bValue === 'string'
        ? aValue.localeCompare(bValue, 'ru', { sensitivity: 'base' })
        : aValue < bValue
          ? -1
          : aValue > bValue
            ? 1
            : 0

    return dir === 'desc' ? -result : result
  })

  const startIndex = payload.limit * (payload.page - 1)
  const paginatedBooks = sortedBooks.slice(startIndex, startIndex + payload.limit)

  return mockResponse({
    books: paginatedBooks,
    total: filteredBooks.length,
  })
}

export const booksMockApi = {
  fetchBooks,
}
