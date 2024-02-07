import { FunctionComponent, useMemo, useState } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { BoardDisplay } from "./BoardDisplay";
import { newGrid } from "../utilities/array";
import { JavaShipDisplay } from "./JavaShipDisplay";
import { getUnsunkenShipIndicesInBoardState } from "../utilities/getUnsunkShipIndicesInBoardState";
import { sinkShip } from "../utilities/sinkShip";
import { sum } from "lodash";

interface Props { }

enum Strategy {
    GridGuesses = "GridGuesses",
    RandomGuesses = "RandomGuesses",
    HideShips = "HideShips",
    RandomPlacement = "RandomPlacement",
}

export const JavaBoard: FunctionComponent<Props> = ({ }) => {
    const [attackState, setAttackState] = useState<Board>(
        newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
    );

    const [defenseState, setDefenseState] = useState<Board>(
        newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
    );
    const [defenseLayoutIsConfirmed, setDefenseLayoutIsConfirmed] =
        useState(false);

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
        if (attackState[row][col].state !== SquareState.UNKNOWN) return;
        const state: number = 1;
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
        let layoutIsValid = unsunkIndices.length === 0;
        if (!layoutIsValid) {
            alert("Invalid layout: not all ships are sunk.");
            return;
        }
        // no more sunk ships than expected
        const sunkSquareNumber = sum(
            defenseState.flatMap((row) =>
                row.map((col) => (col.state === SquareState.SHIP_SUNK ? 1 : 0))
            )
        );
        layoutIsValid = layoutIsValid && sunkSquareNumber === 19;
        if (!layoutIsValid) {
            alert("Invalid layout: too many sunk ships");
            return;
        }
        // ships are not adjacent
        for (let row = 0; row < defenseState.length; row++) {
            for (let col = 0; col < defenseState[row].length; col++) {
                if (defenseState[row][col].state === SquareState.SHIP_SUNK) {
                    layoutIsValid &&=
                        defenseState[row + 1]?.[col - 1]?.state !== SquareState.SHIP_SUNK;
                    layoutIsValid &&=
                        defenseState[row + 1]?.[col + 1]?.state !== SquareState.SHIP_SUNK;
                }
            }
        }
        if (!layoutIsValid) {
            alert("Invalid layout: ships are adjacent.");
            return;
        }
        setDefenseLayoutIsConfirmed(true);
    }

    return (
        <div>
            <div className="flex justify-center mb-10 mt-4">
                <div
                    className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer w-min px-3 py-2 rounded"
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
    );
};
