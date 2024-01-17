import { ShipShape } from "./ship";

export function addSquareToShip(ship: ShipShape, row: number, col: number): ShipShape {
  if (row < 0) {
    ship = [new Array(ship[0].length).fill(false), ...ship];
    row = 0;
  }
  if (col < 0) {
    ship = ship.map((row) => [false, ...row]);
    col = 0;
  }
  if (row >= ship.length) {
    ship = [...ship, new Array(ship[0].length).fill(false)];
  }
  if (col >= ship[0].length) {
    ship = ship.map((row) => [...row, false]);
  }
  ship[row][col] = true;
  return ship
}