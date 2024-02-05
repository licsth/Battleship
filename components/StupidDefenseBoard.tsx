import { FunctionComponent, useMemo, useState } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { BoardDisplay } from "./BoardDisplay";
import {
  ShipShapeVariant,
  possibleConfigurations,
} from "../utilities/bestGuess";
import { ShipShape } from "../utilities/ship";
import { shapesEqualWithoutRotation } from "../utilities/shipShapesEqual";
import { rotateShip } from "../utilities/rotateShip";
import { copySunkShips } from "../utilities/copySunkShips";

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
  const [isLoading, setIsLoading] = useState(false);

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

  // function postGuess(square: number) {
  //   fetch("http://localhost:8080/api/guess", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(square),
  //   }).then(async (response) => {
  //     console.log(await response.text());
  //     return;
  //   });
  // }

  // function requestNextMove() {
  //   setIsLoading(true);
  //   fetch("http://localhost:8080/api/nextMove").then(async (response) => {
  //     console.log(await response.text());
  //     setIsLoading(false);
  //     return;
  //   });
  // }

  function userGuess(row: number, col: number) {
    // requestNextMove();
    // postGuess(row * boardState.length + col);
    const newState = [...boardState.map((row) => [...row])];
    newState[row][col].state = SquareState.MISSED;
    let possibleConfig = possibleConfigurations(
      newState,
      [...unsunkenShipVariants],
      [],
      true
    );
    if (possibleConfig.some((row) => row.some((col) => col !== 0))) {
      setBoardState(newState);
    } else {
      newState[row][col].state = SquareState.UNKNOWN;
      possibleConfig = possibleConfigurations(
        newState,
        [...unsunkenShipVariants],
        [],
        true
      );
      newState[row][col].state = SquareState.SHIP_HIT;
      copySunkShips(newState, possibleConfig);
      setBoardState(newState);
    }
  }

  return (
    <div className="mb-5">
      <BoardDisplay
        boardState={boardState}
        onFieldClick={userGuess}
        isLoading={isLoading}
      />
    </div>
  );
};
