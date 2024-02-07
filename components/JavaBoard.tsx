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
import { newGrid } from "../utilities/array";

interface Props {
    unsunkenShips: ShipShape[];
}

export const JavaBoard: FunctionComponent<Props> = ({
    unsunkenShips,
}) => {

    const [attackState, setAttackState] = useState<Board>(
        newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
    );

    const [defenseState, setDefenseState] = useState<Board>(
        newGrid(8, 8, () => ({ state: SquareState.UNKNOWN }))
    );

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

    enum Strategy {
        GridGuesses = "GridGuesses",
        RandomGuesses = "RandomGuesses",
        HideShips = "HideShips",
        RandomPlacement = "RandomPlacement"
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
        const state: number = 1;
        // TODO ask Java backend whether hit
        const newBoardState = [...attackState];
        if (state === 0) {
            newBoardState[row][col] = { state: SquareState.MISSED };
        } else if (state === 1) {
            newBoardState[row][col] = { state: SquareState.SHIP_HIT };
        } else {
            // TODO find connected component of square
            // TODO set states for entire component
        }
        setAttackState(newBoardState);
    }

    function placeShip(row: number, col: number) {
        const newBoardState = [...defenseState];
        newBoardState[row][col] = { state: defenseState[row][col].state === SquareState.UNKNOWN ? SquareState.SHIP_SUNK : SquareState.UNKNOWN };
        setDefenseState(newBoardState);
    }

    // TODO currently it always uses HideShips and GridGuesses
    return (
        <div className="mb-5">
            <div className="flex gap-x-12">
                <div className="bg-blue-500 text-white cursor-pointer" onClick={() => startGame(Strategy.HideShips, Strategy.GridGuesses)}>
                    Start
                </div>
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
        </div>
    );
};
