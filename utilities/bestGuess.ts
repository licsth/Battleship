import { Board, SquareState } from "./boardState";
import { rotateShip } from "./rotateShip";
import { Orientation, Ship, ShipShape } from "./ship";
import { shipShapesEqual } from "./shipShapesEqual";

let counter = 0;

export function possibleConfigurations(boardState: Board, ships: ShipShape[], placedShips: Ship[], log = false): number[][] {
  counter++;
  if (ships.length === 0) {
    if (boardState.some(row => row.some(square => square.state === SquareState.SHIP_HIT))) {
      return boardState.map(row => row.map(_ => 0))
    }
    return boardState.map(row => row.map(square => square.state === SquareState.SHIP_SUNK ? 1 : 0))
  }
  const ship = ships.pop();
  if (!ship) return boardState.map(row => row.map(_ => 0))
  const transposedShip = rotateShip(ship)
  const shipIsSymmetrical = transposedShip.every((row, i) => row.length === ship[i].length && row.every((square, j) => square === ship[i][j]));

  const configurations = boardState.map(row => row.map(_ => 0));
  // only place ship after last placed ship with same shape
  const lastPlacedShipWithSameShape = placedShips.find(placedShip => shipShapesEqual(placedShip.shape, ship));
  const startY = (lastPlacedShipWithSameShape?.position[1] ?? 0);
  for (let y = startY; y < boardState.length; y++) {
    for (let x = ((y === startY && lastPlacedShipWithSameShape?.position[0]) || -1) + 1; x < boardState[0].length; x++) {
      shipPlacementLoop: for (let orientation of [Orientation.HORIZONTAL, Orientation.VERTICAL]) {
        if (shipIsSymmetrical && orientation === Orientation.VERTICAL) {
          continue;
        }
        let correctShip = orientation === Orientation.VERTICAL ? transposedShip : ship
        if (isShipPlacementPossible(boardState, correctShip, x, y)) {
          const newBoardState = boardState.map(row => row.map(square => ({ ...square })));
          for (let i = 0; i < correctShip.length; i++) {
            for (let j = 0; j < correctShip[i].length; j++) {
              if (correctShip[i][j]) {
                newBoardState[y + i][x + j].state = SquareState.SHIP_SUNK;
                // mark neighbors that don't belong to the ship as missed & check that none are hits
                for (let k = -1; k <= 1; k++) {
                  for (let l = -1; l <= 1; l++) {
                    if (k === 0 && l === 0) continue;
                    if (y + i + k < 0 || y + i + k >= boardState.length || x + j + l < 0 || x + j + l >= boardState[0].length) continue;
                    if (!correctShip[i + k]?.[j + l]) {
                      if (newBoardState[y + i + k][x + j + l].state === SquareState.SHIP_HIT) { // this speeds up computation if there are some hits on the board
                        continue shipPlacementLoop
                      }
                      newBoardState[y + i + k][x + j + l].state = SquareState.MISSED;
                    }
                  }
                }
              }
            }
          }
          // add possibleConfigurations(newBoardState, ships) to configurations component-wise
          const newConfigurations = possibleConfigurations(newBoardState, [...ships], [{ shape: correctShip, position: [x, y], orientation }, ...placedShips,]);
          for (let i = 0; i < newConfigurations.length; i++) {
            for (let j = 0; j < newConfigurations[0].length; j++) {
              configurations[i][j] += newConfigurations[i][j];
            }
          }
        }
      }
    }
  }
  if (log) {
    console.log('Considered states: ', counter)
    counter = 0;
  }
  return configurations
}

function isShipPlacementPossible(boardState: Board, ship: ShipShape, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x + ship[0].length > boardState[0].length || y + ship.length > boardState.length) {
    return false;
  }
  for (let i = 0; i < ship.length; i++) {
    for (let j = 0; j < ship[i].length; j++) {
      if (!ship[i][j]) continue;
      if ((boardState[y + i][x + j].state === SquareState.SHIP_SUNK) || (boardState[y + i][x + j].state === SquareState.MISSED)) {
        return false;
      }
    }
  }
  return true
}