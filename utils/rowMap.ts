export function rowMap(array: unknown[], itemsPerRow: number): unknown[] {
  const rows:unknown[] = []
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
