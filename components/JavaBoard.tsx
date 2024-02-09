import { FunctionComponent, useMemo, useState } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { BoardDisplay } from "./BoardDisplay";
import { newGrid } from "../utilities/array";
import { JavaShipDisplay } from "./JavaShipDisplay";
import { getUnsunkenShipIndicesInBoardState } from "../utilities/getUnsunkShipIndicesInBoardState";
import { sinkShip } from "../utilities/sinkShip";
import { set, sum } from "lodash";
import {
  copyBoardState,
  findHitShip,
  findSunkenShip,
} from "../utilities/findSunkenShip";
import {
  shapesEqualWithoutRotation,
  shipShapesEqual,
} from "../utilities/shipShapesEqual";

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

  const [defenseLayout, setDefenseLayout] = useState<Board>(
    newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
  );
  const [defenseState, setDefenseState] = useState<Board>(
    newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
  );
  const [defenseLayoutIsConfirmed, setDefenseLayoutIsConfirmed] =
    useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [defensiveStrategy, setDefensiveStrategy] = useState(
    DefensiveStrategy.HideShips
  );
  const [offensiveStrategy, setOffensiveStrategy] = useState(
    OffensiveStrategy.GridGuesses
  );
  const [currentGuess, setCurrentGuess] = useState<[number, number] | null>(
    null
  );

  const unsunkenShipIndices = useMemo(
    () =>
      defenseLayoutIsConfirmed
        ? getUnsunkenShipIndicesInBoardState(attackState, ships)
        : getUnsunkenShipIndicesInBoardState(defenseLayout, ships),
    [ships, attackState, defenseLayout, defenseLayoutIsConfirmed]
  );

  const [defenseIsLoading, setDefenseIsLoading] = useState(false);
  const [offenseIsLoading, setOffenseIsLoading] = useState(false);

  function startGame(
    defensiveStrategy: DefensiveStrategy,
    offensiveStrategy: OffensiveStrategy
  ) {
    fetch("http://localhost:8080/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ defensiveStrategy, offensiveStrategy }),
    })
      .then(async (response) => {
        setGameStarted(true);
        console.log(await response.text());
        return;
      })
      .catch((e) => {
        console.error(e);
        alert("Error fetching game start response.");
      });
  }

  async function postGuess(square: number) {
    setOffenseIsLoading(true);
    const res = await fetch("http://localhost:8080/api/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(square),
    }).finally(() => setOffenseIsLoading(false));
    const state = await res.text();
    return Number(state);
  }

  async function requestNextMove() {
    setDefenseIsLoading(true);
    const res = await fetch("http://localhost:8080/api/nextMove");
    const move = Number(await res.text());
    const row = Math.floor(move / 8);
    const col = move % 8;
    console.log("Computer move:", move, `(${row}, ${col})`);
    let returnState = 0;
    if (defenseLayout[row][col].state === SquareState.SHIP_SUNK) {
      defenseState[row][col] = { state: SquareState.SHIP_HIT };
      const hitShip = findHitShip(copyBoardState(defenseState), col, row);
      const fullShip: boolean[][] = findSunkenShip(
        copyBoardState(defenseLayout),
        col,
        row
      );
      if (shapesEqualWithoutRotation(hitShip, fullShip)) {
        returnState = 2;
      } else {
        returnState = 1;
      }
    } else {
      defenseState[row][col] = { state: SquareState.MISSED };
    }
    console.log("Returning state", returnState);
    setDefenseState([...defenseState]);
    await fetch("http://localhost:8080/api/respondToGuess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess: move, state: returnState }),
    }).finally(() => setDefenseIsLoading(false));
  }

  async function confirmGuess() {
    if (!currentGuess) return;
    const row = currentGuess[0];
    const col = currentGuess[1];
    if (!defenseLayoutIsConfirmed) return;
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
    setCurrentGuess(null);
    setAttackState(newBoardState);
    requestNextMove();
  }

  function placeShip(row: number, col: number) {
    if (defenseLayoutIsConfirmed || !gameStarted) return;
    const newBoardState = [...defenseLayout];
    newBoardState[row][col] = {
      state:
        defenseLayout[row][col].state === SquareState.UNKNOWN
          ? SquareState.SHIP_SUNK
          : SquareState.UNKNOWN,
    };
    setDefenseLayout(newBoardState);
  }

  function checkDefenseLayout() {
    if (defenseLayoutIsConfirmed) return;
    // all ships are sunk
    const unsunkIndices = getUnsunkenShipIndicesInBoardState(
      defenseLayout,
      ships
    );
    if (unsunkIndices.length !== 0) {
      alert("Invalid layout: not all ships are sunk.");
      return;
    }
    // no more sunk ships than expected
    const sunkSquareNumber = sum(
      defenseLayout.flatMap((row) =>
        row.map((col) => (col.state === SquareState.SHIP_SUNK ? 1 : 0))
      )
    );
    if (sunkSquareNumber !== 19) {
      alert("Invalid layout: too many sunk ships");
      return;
    }
    // ships are not adjacent
    for (let row = 0; row < defenseLayout.length; row++) {
      for (let col = 0; col < defenseLayout[row].length; col++) {
        if (defenseLayout[row][col].state === SquareState.SHIP_SUNK) {
          if (
            defenseLayout[row + 1]?.[col - 1]?.state ===
              SquareState.SHIP_SUNK ||
            defenseLayout[row + 1]?.[col + 1]?.state === SquareState.SHIP_SUNK
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
      <div className="flex justify-center mb-8 mt-4 gap-x-6 items-center">
        <div>
          <label className="block text-[10px] mb-1 text-cyan-700">
            Defensive strategy
          </label>
          {gameStarted ? (
            <p className="text-sm">{defensiveStrategy}</p>
          ) : (
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
          )}
        </div>
        <div>
          <label className="block text-[10px] mb-1 text-cyan-700">
            Offensive strategy
          </label>
          {gameStarted ? (
            <p className="text-sm">{offensiveStrategy}</p>
          ) : (
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
          )}
        </div>
        {!gameStarted && (
          <div>
            <div
              className="bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer w-min px-3 py-2 rounded"
              onClick={() => startGame(defensiveStrategy, offensiveStrategy)}
            >
              Start
            </div>
          </div>
        )}
      </div>
      {gameStarted && (
        <div>
          <div className="grid grid-cols-2 gap-x-12">
            <div>
              <BoardDisplay
                boardState={
                  defenseLayoutIsConfirmed ? defenseState : defenseLayout
                }
                getFieldBackgroundColor={(row, col) => {
                  if (
                    defenseLayoutIsConfirmed &&
                    defenseLayout[row][col].state === SquareState.SHIP_SUNK
                  ) {
                    return "hsl(200, 60%, 80%)";
                  }
                }}
                disableLoadingAnimation={(row, col) => {
                  if (
                    defenseLayoutIsConfirmed &&
                    defenseLayout[row][col].state === SquareState.SHIP_SUNK
                  ) {
                    return true;
                  }
                  return false;
                }}
                onFieldClick={placeShip}
                isLoading={defenseIsLoading}
              />
            </div>
            <div>
              <BoardDisplay
                boardState={attackState}
                onFieldClick={(row, col) => setCurrentGuess([row, col])}
                isLoading={offenseIsLoading}
                getFieldBackgroundColor={(row, col) => {
                  if (!currentGuess) return undefined;
                  if (row === currentGuess[0] && col === currentGuess[1])
                    return "hsl(270, 60%, 80%)";
                }}
              />
            </div>
          </div>
          {!defenseLayoutIsConfirmed ? (
            <div className="flex justify-center my-4">
              <button
                onClick={checkDefenseLayout}
                className="bg-purple-400 hover:bg-purple-500 text-white rounded p-2 text-xs w-32 shadow-sm"
              >
                Confirm Layout
              </button>
            </div>
          ) : (
            <div className="flex justify-center my-4">
              <button
                onClick={confirmGuess}
                className="bg-purple-400 hover:bg-purple-500 text-white rounded p-2 text-xs w-32 shadow-sm"
              >
                Guess
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
      )}
    </div>
  );
};
