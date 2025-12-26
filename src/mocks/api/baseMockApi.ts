export const mockResponse = <T>(data: T, timeout = 200) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), timeout)
  })
}
