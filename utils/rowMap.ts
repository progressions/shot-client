type Row<T> = T[][]

export function rowMap<T>(array: T[], itemsPerRow: number): Row<T> {
  const rows:T[][] = []
  for (let i=0; i <= array.length; i+=itemsPerRow) {
    const row = []
    for (let j=0; j < itemsPerRow; j++) {
      if (i+j < array.length) {
        row.push(array[i+j])
      }
    }
    rows.push(row)
  }
  return rows
}
