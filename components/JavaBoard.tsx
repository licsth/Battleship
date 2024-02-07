import { FunctionComponent, useMemo, useState } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { BoardDisplay } from "./BoardDisplay";
import { newGrid } from "../utilities/array";
import { JavaShipDisplay } from "./JavaShipDisplay";
import { getUnsunkenShipIndicesInBoardState } from "../utilities/getUnsunkShipIndicesInBoardState";
import { sinkShip } from "../utilities/sinkShip";

interface Props {}

export const JavaBoard: FunctionComponent<Props> = ({}) => {
  const [attackState, setAttackState] = useState<Board>(
    newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
  );

  const [defenseState, setDefenseState] = useState<Board>(
    newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
  );

  const ships = [
    [[true, true]],
    [[true, true]],
    [[true, true]],
    [[true, true, true]],
    [[true, true, true]],
    [[true, true, true]],
    [[true, true, true, true]],
  ];

  const unsunkenShipIndices = useMemo(
    () => getUnsunkenShipIndicesInBoardState(attackState, ships),
    [ships, attackState]
  );

  const [isLoading, setIsLoading] = useState(false);

  enum Strategy {
    GridGuesses = "GridGuesses",
    RandomGuesses = "RandomGuesses",
    HideShips = "HideShips",
    RandomPlacement = "RandomPlacement",
  }

  function startGame(ds: Strategy, os: Strategy) {
    // TODO make API call
  }

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
    const state: number = 2;
    // TODO ask Java backend whether hit
    const newBoardState = [...attackState];
    if (state === 0) {
      newBoardState[row][col] = { state: SquareState.MISSED };
    } else if (state === 1) {
      newBoardState[row][col] = { state: SquareState.SHIP_HIT };
    } else {
      newBoardState[row][col] = { state: SquareState.SHIP_HIT };
      sinkShip(newBoardState, row, col);
    }
    setAttackState(newBoardState);
  }

  function placeShip(row: number, col: number) {
    const newBoardState = [...defenseState];
    newBoardState[row][col] = {
      state:
        defenseState[row][col].state === SquareState.UNKNOWN
          ? SquareState.SHIP_SUNK
          : SquareState.UNKNOWN,
    };
    setDefenseState(newBoardState);
  }

  return (
    <div className="mb-5">
      <div className="flex justify-center mb-10">
        <div
          className="bg-blue-500 text-white cursor-pointer w-min px-3 py-2 rounded"
          onClick={() => startGame(Strategy.HideShips, Strategy.GridGuesses)}
        >
          Start
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-12">
        <div>
          <BoardDisplay
            boardState={defenseState}
            onFieldClick={placeShip}
            isLoading={isLoading}
          />
          <button
            onClick={() => {}}
            className="bg-purple-400 hover:bg-purple-500 text-white rounded p-2 text-xs w-32 shadow-sm"
          >
            Confirm Layout
          </button>
        </div>
        <div>
          <BoardDisplay
            boardState={attackState}
            onFieldClick={userGuess}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <JavaShipDisplay
          ships={ships}
          unsunkenShipIndices={unsunkenShipIndices}
        />
      </div>
    </div>
  );
};
