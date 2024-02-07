import { Board, SquareState } from "./boardState";
import { findHitShip } from "./findSunkenShip";

export function sinkShip(boardState: Board, row: number, col: number) {
  const sunkenShip = findHitShip(boardState, col, row);
  if (sunkenShip) {
    for (let y = 0; y < sunkenShip.length; y++) {
      for (let x = 0; x < sunkenShip[y].length; x++) {
        if (!sunkenShip[y][x]) continue;
        boardState[y][x].state = SquareState.SHIP_SUNK;
        //update all non-ship neighbors to missed
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              x + i >= 0 &&
              x + i < boardState.length &&
              y + j >= 0 &&
              y + j < boardState.length
            ) {
              if (!sunkenShip[y + j][x + i]) {
                boardState[y + j][x + i].state = SquareState.MISSED;
              }
            }
          }
        }
      }
    }
  }
}