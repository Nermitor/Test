import { mockResponse } from '@/mocks/mockApi.ts'

const fetchOptions = () => {
  return mockResponse([
    {
      value: 'readers_desc',
      label: 'Количество читалей по убыванию',
    },
    {
      value: 'readers_asc',
      label: 'Количество читалей по возрастанию',
    },
    {
      value: 'year_desc',
      label: 'Год по убыванию',
    },
    {
      value: 'year_asc',
      label: 'Год по возрастанию',
    },
  ])
}

export const optionsMockApi = {
  fetchOptions,
}
