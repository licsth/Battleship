import { addSquareToShip } from "./addSquareToShip";
import { Board, SquareState } from "./boardState";
import { ShipShape } from "./ship";

export function findSunkenShipAndShift(boardState: Board, startX?: number, startY?: number): [ShipShape, number, number] | null {
  const boardY = boardState.findIndex((row) => row.some((square) => square.state === SquareState.SHIP_SUNK));
  if (boardY === -1) {
    return null;
  }
  const boardX = boardState[boardY].findIndex((square) => square.state === SquareState.SHIP_SUNK);
  if (boardX === -1) {
    return null;
  }
  if (startX && startY && boardState[boardY][boardX].state !== SquareState.SHIP_SUNK) return null
  const res = extendShipRecursively(boardState, [[]], startX ?? boardX, startY ?? boardY, 0, 0);
  return res;
}

export function findSunkenShip(boardState: Board): ShipShape | null {
  const res = findSunkenShipAndShift(boardState);
  if (res === null) {
    return null;
  }
  return res[0]
}

/**
 * 
 * @param boardState current state of the board
 * @param ship connected component of the ship identified so far
 * @param boardX next square coordinates to check
 * @param boardY 
 * @param shipX next ship coordinates to extend
 * @param shipY 
 * @returns updated ship shape, x shift of ship indices, y shift of ship indices
 */
function extendShipRecursively(boardState: Board, ship: ShipShape, boardX: number, boardY: number, shipX: number, shipY: number): [ShipShape, number, number] {
  if (boardX < 0 || boardY < 0 || boardX >= boardState[0].length || boardY >= boardState.length) {
    return [ship, 0, 0];
  }
  if (boardState[boardY][boardX].state !== SquareState.SHIP_SUNK) {
    return [ship, 0, 0];
  }
  ship = addSquareToShip(ship, shipY, shipX);
  let totalXShift = 0;
  let totalYShift = 0;
  // indices are now shifted because the ship was extended to the left/top
  if (shipY < 0) { shipY = 0; totalYShift = 1; }
  if (shipX < 0) { shipX = 0; totalXShift = 1; }
  boardState[boardY][boardX].state = SquareState.MISSED; // remove sunk ship from boardState
  for (let i of [-1, 1]) {
    let res = extendShipRecursively(boardState, ship, boardX + i, boardY, shipX + i, shipY);
    // factor in index shifts done recursively
    ship = res[0];
    shipX += res[1];
    totalXShift += res[1];
    shipY += res[2];
    totalYShift += res[2];
    res = extendShipRecursively(boardState, ship, boardX, boardY + i, shipX, shipY + i);
    ship = res[0];
    shipX += res[1];
    totalXShift += res[1];
    shipY += res[2];
    totalYShift += res[2];
  }
  return [ship, totalXShift, totalYShift]
}