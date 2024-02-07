import { range } from "lodash";
import { Board } from "./boardState";
import { ShipShape } from "./ship";
import { trimShip } from "./trimShip";
import { copyBoardState, findSunkenShip } from "./findSunkenShip";
import { shipShapesEqual } from "./shipShapesEqual";

export function getUnsunkenShipIndicesInBoardState(boardState: Board, ships: ShipShape[]): number[] {
  let indices = range(ships.length);

  const boardStateCopy = copyBoardState(boardState);
  let sunkenShip: ShipShape | null = null;
  while ((sunkenShip = trimShip(findSunkenShip(boardStateCopy))) != null) {
    const shipIndex = ships.findIndex(
      (ship, index) =>
        indices.includes(index) &&
        shipShapesEqual(sunkenShip as ShipShape, ship)
    );
    indices = indices.filter((index) => index !== shipIndex);
  }
  return indices;
}