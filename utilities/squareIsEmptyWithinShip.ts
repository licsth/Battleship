import { ShipShape } from "./ship";

export function squareIsEmptyWithinShip(ship: ShipShape, rowIndex: number, colIndex: number) {
  const row = ship[rowIndex];
  const squareValue = row[colIndex]
  if (
    rowIndex === 0 ||
    colIndex === 0 ||
    rowIndex === ship.length - 1 ||
    colIndex === row.length - 1
  )
    return false;
  if (!squareValue && row[colIndex - 1] && row[colIndex + 1]) return true;
  if (
    !squareValue &&
    ship[rowIndex - 1][colIndex] &&
    ship[rowIndex + 1][colIndex]
  )
    return true;
}