export function newGrid<T>(width: number, height: number, value: () => T): T[][] {
  return new Array(width)
    .fill(new Array(height).fill(0))
    .map((row) => row.map(() => value()))
}