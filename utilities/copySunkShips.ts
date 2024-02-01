import { Board, SquareState } from "./boardState";
import { findSunkenShip } from "./findSunkenShip";

export function copySunkShips(boardState: Board, possibleConfig: number[][]) {
  const hitPositions = boardState.flatMap((row, y) => row.map((square, x) => ({ x, y, square })).filter(({ square }) => square.state === SquareState.SHIP_HIT));
  hitPositions.forEach(({ x, y }) => copySunkShipAt(boardState, possibleConfig, y, x));
}

export function copySunkShipAt(boardState: Board, possibleConfig: number[][], row: number, col: number) {
  if (boardState[row][col].state !== SquareState.SHIP_HIT) return;
  const possibleConfigBoardState = possibleConfig.map(row => row.map(col => ({ state: col ? SquareState.SHIP_SUNK : SquareState.UNKNOWN })));

  const ship = findSunkenShip(possibleConfigBoardState, col, row);
  if (ship) {
    let allDiscovered = true;
    for (let y = 0; y < ship.length; y++) {
      for (let x = 0; x < ship[y].length; x++) {
        if (ship[y][x] && boardState[y][x].state === SquareState.UNKNOWN) { allDiscovered = false; }
      }
    }
    if (allDiscovered) {
      for (let y = 0; y < ship.length; y++) {
        for (let x = 0; x < ship[y].length; x++) {
          if (!ship[y][x]) continue;
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

