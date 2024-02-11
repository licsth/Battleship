import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Board, SquareState } from '../utilities/boardState';
import {
  ShipShapeVariant,
  possibleConfigurations,
} from '../utilities/bestGuess';
import { ShipShape } from '../utilities/ship';
import { shapesEqualWithoutRotation } from '../utilities/shipShapesEqual';
import { rotateShip } from '../utilities/rotateShip';
import { copySunkShips } from '../utilities/copySunkShips';
import { BoardDisplay } from './BoardDisplay';

interface Props {
  boardState: Board;
  setBoardState: (boardState: Board) => void;
  unsunkenShips: ShipShape[];
}

export const StupidDefenseBoard: FunctionComponent<Props> = ({
  boardState,
  setBoardState,
  unsunkenShips,
}) => {
  const [isLoading] = useState(false);
  const [guessCount, setGuessCount] = useState(0);

  useEffect(() => {
    if (
      boardState.every((row) =>
        row.every((square) => square.state === SquareState.UNKNOWN),
      )
    ) {
      // reset count on board reset
      setGuessCount(0);
    }
  }, [boardState]);

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
    setGuessCount(guessCount + 1);
    const newState = [...boardState.map((row) => [...row])];
    newState[row][col].state = SquareState.MISSED;
    let possibleConfig = possibleConfigurations(
      newState,
      [...unsunkenShipVariants],
      [],
      true,
    );
    if (possibleConfig.some((row) => row.some((col) => col !== 0))) {
      setBoardState(newState);
    } else {
      newState[row][col].state = SquareState.UNKNOWN;
      possibleConfig = possibleConfigurations(
        newState,
        [...unsunkenShipVariants],
        [],
        true,
      );
      newState[row][col].state = SquareState.SHIP_HIT;
      copySunkShips(newState, possibleConfig);
      setBoardState(newState);
    }
  }

  return (
    <div className="mb-5">
      <div className="text-sm text-center mb-3">Guess count: {guessCount}</div>
      <BoardDisplay
        boardState={boardState}
        onFieldClick={userGuess}
        isLoading={isLoading}
      />
    </div>
  );
};
