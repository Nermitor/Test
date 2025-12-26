export const parseRange = (value: string | undefined): [number, number] | undefined => {
  if (!value) return

  const parts = value.split(',').map(Number)
  if (parts.length === 2) {
    const [part1, part2] = parts
    if (part1 !== undefined && part2 !== undefined && !isNaN(part1) && !isNaN(part2)) {
      return [part1, part2] as [number, number]
    }
  }
  return
}

export const isRangeDifferent = (
  current: [number, number] | undefined,
  defaultValue: [number, number] | undefined,
) => {
  if (!current || !defaultValue) return false
  return current[0] !== defaultValue[0] || current[1] !== defaultValue[1]
}
