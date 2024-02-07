import { Board, SquareState } from "./boardState";
import { findHitShip } from "./findSunkenShip";

export function sinkShip(boardState: Board, row: number, col: number) {
  const sunkenShip = findHitShip(boardState, col, row);
  if (sunkenShip) {
    for (let y = 0; y < sunkenShip.length; y++) {
      for (let x = 0; x < sunkenShip[y].length; x++) {
        if (!sunkenShip[y][x]) continue;
        boardState[y][x].state = SquareState.SHIP_SUNK;
      }
    }
  }
}