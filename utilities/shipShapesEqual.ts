import { rotateShip } from "./rotateShip";
import { ShipShape } from "./ship";

export function shipShapesEqual(ship1: ShipShape, ship2: ShipShape) {
  for (let i = 0; i < 4; i++) {
    if (shapesEqualWithoutRotation(ship1, ship2)) {
      return true;
    }
    if (i !== 3) ship1 = rotateShip(ship1);
  }
  return false;
}

export function shapesEqualWithoutRotation(ship1: ShipShape, ship2: ShipShape) {
  if (ship1.length !== ship2.length) {
    return false;
  }
  for (let i = 0; i < ship1.length; i++) {
    if (ship1[i].length !== ship2[i].length) {
      return false;
    }
    for (let j = 0; j < ship1[i].length; j++) {
      if (ship1[i][j] !== ship2[i][j]) {
        return false;
      }
    }
  }
  return true;
}