import { ShipShape } from "./ship";

export function trimShip(ship: ShipShape | null): ShipShape | null {
  if (!ship) return null;
  if (ship.every(row => row.every(square => !square))) return null;
  while (ship[0].every(square => !square)) {
    ship.shift();
  }
  while (ship[ship.length - 1].every(square => !square)) {
    ship.pop();
  }
  while (ship.every(row => !row[0])) {
    ship.forEach(row => row.shift());
  }
  while (ship.every(row => !row[row.length - 1])) {
    ship.forEach(row => row.pop());
  }
  return ship;
}