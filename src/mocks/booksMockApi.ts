import { mockResponse } from '@/mocks/mockApi.ts'
import { books } from '@/mocks/books.ts'
import type { BookCardType } from '@/types/BookCard.ts'

export type PayloadType = {
  sort: string
  search: string
  page: number
  limit: number
}

const fetchBooks = (payload: PayloadType) => {
  const [field, dir] = payload.sort.split('_') as [keyof BookCardType, string]

  const filteredBooks = books.filter(
    (book) =>
      !payload.search ||
      book.author.toLowerCase().includes(payload.search.toLowerCase()) ||
      book.description.toLowerCase().includes(payload.search.toLowerCase()) ||
      book.title.toLowerCase().includes(payload.search.toLowerCase()),
  )

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let result
    if (a[field] < b[field]) {
      result = -1
    } else if (a[field] > b[field]) {
      result = 1
    } else {
      result = 0
    }
    if (dir === 'desc') {
      result *= -1
    }

    return result
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
