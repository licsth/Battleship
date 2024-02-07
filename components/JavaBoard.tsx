import { FunctionComponent, useMemo, useState } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { BoardDisplay } from "./BoardDisplay";
import { newGrid } from "../utilities/array";
import { JavaShipDisplay } from "./JavaShipDisplay";
import { getUnsunkenShipIndicesInBoardState } from "../utilities/getUnsunkShipIndicesInBoardState";
import { sinkShip } from "../utilities/sinkShip";
import { set, sum } from "lodash";

interface Props {}

enum DefensiveStrategy {
  HideShips = "HideShips",
  RandomPlacement = "RandomPlacement",
}

enum OffensiveStrategy {
  GridGuesses = "GridGuesses",
  RandomGuesses = "RandomGuesses",
}

const ships = [
  [[true, true]],
  [[true, true]],
  [[true, true]],
  [[true, true, true]],
  [[true, true, true]],
  [[true, true, true]],
  [[true, true, true, true]],
];

export const JavaBoard: FunctionComponent<Props> = ({}) => {
  const [attackState, setAttackState] = useState<Board>(
    newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
  );

  const [defenseState, setDefenseState] = useState<Board>(
    newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
  );
  const [defenseLayoutIsConfirmed, setDefenseLayoutIsConfirmed] =
    useState(false);

  const [defensiveStrategy, setDefensiveStrategy] = useState(
    DefensiveStrategy.HideShips
  );
  const [offensiveStrategy, setOffensiveStrategy] = useState(
    OffensiveStrategy.GridGuesses
  );

  const unsunkenShipIndices = useMemo(
    () => getUnsunkenShipIndicesInBoardState(attackState, ships),
    [ships, attackState]
  );

  const [isLoading, setIsLoading] = useState(false);

  function startGame(
    defensiveStrategy: DefensiveStrategy,
    offensiveStrategy: OffensiveStrategy
  ) {
    // TODO make API call
    fetch("http://localhost:8080/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ defensiveStrategy, offensiveStrategy }),
    }).then(async (response) => {
      console.log(await response.text());
      return;
    });
  }

  async function postGuess(square: number) {
    setIsLoading(true);
    const res = await fetch("http://localhost:8080/api/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(square),
    });
    const state = await res.text();
    setIsLoading(false);
    return Number(state);
  }

  async function requestNextMove() {
    setIsLoading(true);
    const res = await fetch("http://localhost:8080/api/nextMove");
    const move = Number(await res.text());
    console.log("Computer move:", move);
    setIsLoading(false);
  }

  async function userGuess(row: number, col: number) {
    if (attackState[row][col].state !== SquareState.UNKNOWN) return;
    const state: number = await postGuess(row * 8 + col);
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
    requestNextMove();
  }

  function placeShip(row: number, col: number) {
    if (defenseLayoutIsConfirmed) return;
    const newBoardState = [...defenseState];
    newBoardState[row][col] = {
      state:
        defenseState[row][col].state === SquareState.UNKNOWN
          ? SquareState.SHIP_SUNK
          : SquareState.UNKNOWN,
    };
    setDefenseState(newBoardState);
  }

  function checkDefenseLayout() {
    if (defenseLayoutIsConfirmed) return;
    // all ships are sunk
    const unsunkIndices = getUnsunkenShipIndicesInBoardState(
      defenseState,
      ships
    );
    if (unsunkIndices.length !== 0) {
      alert("Invalid layout: not all ships are sunk.");
      return;
    }
    // no more sunk ships than expected
    const sunkSquareNumber = sum(
      defenseState.flatMap((row) =>
        row.map((col) => (col.state === SquareState.SHIP_SUNK ? 1 : 0))
      )
    );
    if (sunkSquareNumber !== 19) {
      alert("Invalid layout: too many sunk ships");
      return;
    }
    // ships are not adjacent
    for (let row = 0; row < defenseState.length; row++) {
      for (let col = 0; col < defenseState[row].length; col++) {
        if (defenseState[row][col].state === SquareState.SHIP_SUNK) {
          if (
            defenseState[row + 1]?.[col - 1]?.state === SquareState.SHIP_SUNK ||
            defenseState[row + 1]?.[col + 1]?.state === SquareState.SHIP_SUNK
          ) {
            alert("Invalid layout: ships are adjacent.");
            return;
          }
        }
      }
    }
    setDefenseLayoutIsConfirmed(true);
  }

  return (
    <div>
      <div className="flex justify-center mb-8 mt-4 gap-x-5 items-center">
        <div>
          <label className="block text-[10px] mb-1 text-cyan-700">
            Defensive strategy
          </label>
          <select
            className="rounded text-xs px-1 py-2 shadow-sm"
            onChange={(e) =>
              setDefensiveStrategy(e.target.value as DefensiveStrategy)
            }
          >
            {Object.values(DefensiveStrategy).map((strat) => (
              <option key={strat} value={strat}>
                {strat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] mb-1 text-cyan-700">
            Offensive strategy
          </label>
          <select
            className="rounded text-xs px-1 py-2 shadow-sm"
            onChange={(e) =>
              setOffensiveStrategy(e.target.value as OffensiveStrategy)
            }
          >
            {Object.values(OffensiveStrategy).map((strat) => (
              <option key={strat} value={strat}>
                {strat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div
            className="bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer w-min px-3 py-2 rounded"
            onClick={() => startGame(defensiveStrategy, offensiveStrategy)}
          >
            Start
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-x-12">
          <div>
            <BoardDisplay
              boardState={defenseState}
              onFieldClick={placeShip}
              isLoading={isLoading}
            />
          </div>
          <div>
            <BoardDisplay
              boardState={attackState}
              onFieldClick={userGuess}
              isLoading={isLoading}
            />
          </div>
        </div>
        {!defenseLayoutIsConfirmed && (
          <div className="flex justify-center my-4">
            <button
              onClick={checkDefenseLayout}
              className="bg-purple-400 hover:bg-purple-500 text-white rounded p-2 text-xs w-32 shadow-sm"
            >
              Confirm Layout
            </button>
          </div>
        )}
        <div className="flex items-center justify-center">
          <JavaShipDisplay
            ships={ships}
            unsunkenShipIndices={unsunkenShipIndices}
          />
        </div>
      </div>
    </div>
  );
};
