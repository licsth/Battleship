import { ShipShape } from "./ship";

export function rotateShip(ship: ShipShape): ShipShape {
  return ship[0].map((_, i) => ship.map(row => row[i]));
}