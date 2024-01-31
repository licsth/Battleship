import { Board, SquareState } from "./boardState";
import { findSunkenShipAndShift } from "./findSunkenShip";

export function copySunkShips(boardState: Board, possibleConfig: number[][], row: number, col: number) {
  const possibleCondifBoardState = possibleConfig.map(row => row.map(col => ({ state: col ? SquareState.SHIP_SUNK : SquareState.UNKNOWN })));

  const res = findSunkenShipAndShift(possibleCondifBoardState, col, row);
  if (res) {
    const [ship, xShift, yShift] = res;
    let allDiscovered = true;
    for (let i = 0; i < ship.length; i++) {
      for (let j = 0; j < ship[i].length; j++) {
        if (!ship[i][j]) continue;
        if (boardState[i + row - yShift][j + col - xShift].state === SquareState.UNKNOWN) { allDiscovered = false; }
      }
    }
    if (allDiscovered) {
      for (let i = 0; i < ship.length; i++) {
        for (let j = 0; j < ship[i].length; j++) {
          if (!ship[i][j]) continue;
          const y = i + row - yShift;
          const x = j + col - xShift;
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
                if (possibleConfig[y + j][x + i] === 0) {
                  boardState[y + j][x + i].state = SquareState.MISSED;
                }
              }
            }
          }
        }
      }
    }
  }
}

