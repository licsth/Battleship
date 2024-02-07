import { Board, SquareState } from "./boardState";
import { ShipShape } from "./ship";

export function findSunkenShip(boardState: Board, startX?: number, startY?: number): ShipShape {
  return findConnectedComponent(boardState.map(row => row.map(col => ({ ...col }))), SquareState.SHIP_SUNK, startX, startY);
}

export function findHitShip(boardState: Board, startX?: number, startY?: number): ShipShape {
  return findConnectedComponent(boardState.map(row => row.map(col => ({ ...col }))), SquareState.SHIP_HIT, startX, startY);
}

function findConnectedComponent(boardState: Board, searchState: SquareState, startX?: number, startY?: number,): ShipShape {
  const startShip = boardState.map(row => row.map(_ => false));
  const boardY = boardState.findIndex((row) => row.some((square) => square.state === searchState));
  if (boardY === -1) {
    return startShip;
  }
  const boardX = boardState[boardY].findIndex((square) => square.state === searchState);
  if (boardX === -1) {
    return startShip;
  }
  if (startX && startY && boardState[boardY][boardX].state !== searchState) return startShip
  const res = extendShipRecursively(boardState, startShip, startX ?? boardX, startY ?? boardY, searchState);
  return res;
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
function extendShipRecursively(boardState: Board, ship: ShipShape, boardX: number, boardY: number, searchState: SquareState): ShipShape {
  if (boardX < 0 || boardY < 0 || boardX >= boardState[0].length || boardY >= boardState.length) {
    return ship;
  }
  if (boardState[boardY][boardX].state !== searchState) {
    return ship;
  }
  ship[boardY][boardX] = true;
  boardState[boardY][boardX].state = SquareState.MISSED; // remove sunk ship from boardState
  for (let i of [-1, 1]) {
    ship = extendShipRecursively(boardState, ship, boardX + i, boardY, searchState);
    ship = extendShipRecursively(boardState, ship, boardX, boardY + i, searchState);
  }
  return ship
}