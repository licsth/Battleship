import { FunctionComponent, useMemo } from 'react';
import { Board, SquareState } from '../utilities/boardState';
import {
  ShipShapeVariant,
  possibleConfigurations,
} from '../utilities/bestGuess';
import { ShipShape } from '../utilities/ship';
import {
  shapesEqualWithoutRotation,
  shipShapesEqual,
} from '../utilities/shipShapesEqual';
import { rotateShip } from '../utilities/rotateShip';
import { sinkShip } from '../utilities/sinkShip';
import { trimShip } from '../utilities/trimShip';
import { copyBoardState } from '../utilities/findSunkenShip';
import { BoardDisplay } from './BoardDisplay';

interface Props {
  boardState: Board;
  setBoardState: (boardState: Board) => void;
  unsunkenShips: ShipShape[];
}

export const NiceBoard: FunctionComponent<Props> = ({
  boardState,
  setBoardState,
  unsunkenShips,
}) => {
  const unsunkenShipVariants = useMemo<ShipShapeVariant[]>(() => {
    return unsunkenShips.map((ship) => {
      const transposed = rotateShip(ship);
      return {
        normal: [...ship],
        transposed: shapesEqualWithoutRotation(ship, transposed)
          ? null
          : transposed,
      };
    });
  }, [unsunkenShips]);

  function userGuess(row: number, col: number) {
    if (boardState[row][col].state !== SquareState.UNKNOWN) {
      return;
    }
    const sunkState = copyBoardState(boardState);
    sunkState[row][col].state = SquareState.SHIP_HIT;
    // check if it's possible to sink the ship
    const sunkShip = trimShip(sinkShip(sunkState, row, col));
    const sunkShipIndex = sunkShip
      ? unsunkenShips.findIndex((ship) => shipShapesEqual(ship, sunkShip))
      : -1;
    if (sunkShip && sunkShipIndex !== -1) {
      console.log(sunkShipIndex);
      const possibleConfig = possibleConfigurations(
        sunkState,
        [...unsunkenShipVariants.filter((_, index) => index !== sunkShipIndex)],
        [],
        true,
      );
      if (possibleConfig.some((row) => row.some((col) => col !== 0))) {
        setBoardState(sunkState);
        return;
      }
    }
    // try hitting next
    const hitState = copyBoardState(boardState);
    hitState[row][col].state = SquareState.SHIP_HIT;
    const possibleConfig = possibleConfigurations(
      hitState,
      [...unsunkenShipVariants],
      [],
      true,
    );
    if (possibleConfig.some((row) => row.some((col) => col !== 0))) {
      setBoardState(hitState);
      return;
    }
    // if hit is impossible, mark as missed
    const missedState = copyBoardState(boardState);
    missedState[row][col].state = SquareState.MISSED;
    setBoardState(missedState);
    return;
  }

  return (
    <div className="mb-5">
      <BoardDisplay boardState={boardState} onFieldClick={userGuess} />
    </div>
  );
};
