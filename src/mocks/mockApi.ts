export const mockResponse = <T>(data: T, timeout: number = 200) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), timeout)
  })
}
