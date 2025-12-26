import { mockResponse } from '@/mocks'
import { optionsMock } from '@/mocks'

const fetchOptions = () => {
  return mockResponse(optionsMock)
}

export const optionsMockApi = {
  fetchOptions,
}
