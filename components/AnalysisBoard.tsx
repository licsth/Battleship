import { FunctionComponent, useMemo } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { range } from "lodash";
import { classNames } from "../utilities/classNames";
import { nextSquareState } from "../utilities/nextSquareState";
import { rotateShip } from "../utilities/rotateShip";
import { ShipShape } from "../utilities/ship";
import { possibleConfigurations } from "../utilities/bestGuess";
import { shapesEqualWithoutRotation } from "../utilities/shipShapesEqual";

interface Props {
  boardSize: number;
  showFullOutput: boolean;
  isLoading: boolean;
  possibleConfigs: number[][] | null;
  boardState: Board;
  setBoardState: (boardState: Board) => void;
  setComputationTime: (computationTime: number) => void;
  unsunkenShips: ShipShape[];
  setPossibleConfigs: (possibleConfigs: number[][] | null) => void;
}

export const AnalysisBoard: FunctionComponent<Props> = ({
  boardSize,
  showFullOutput,
  isLoading,
  possibleConfigs,
  boardState,
  setBoardState,
  setComputationTime,
  unsunkenShips,
  setPossibleConfigs,
}) => {
  function calculatePossibleConfigs() {
    const time = Date.now();
    setPossibleConfigs(
      possibleConfigurations(
        boardState,
        unsunkenShips.map((ship) => {
          const transposed = rotateShip(ship);
          return {
            normal: [...ship],
            transposed: shapesEqualWithoutRotation(ship, transposed)
              ? null
              : transposed,
          };
        }),
        [],
        false,
        true
      )
    );
    setComputationTime(Date.now() - time);
  }

  const highestConfigurationCount = useMemo(() => {
    if (!possibleConfigs) return 0;
    return Math.max(
      ...possibleConfigs.map((row, i) =>
        Math.max(
          ...row.map((col, j) =>
            boardState[i][j].state === SquareState.UNKNOWN ? col : 0
          )
        )
      )
    );
  }, [possibleConfigs]);

  return (
    <>
      <div className="block mb-5">
        {range(boardSize).map((row) => (
          <div className="flex flex-row gap-2 mb-2" key={"row-" + row}>
            {range(boardSize).map((col) => (
              <div
                key={"row-" + row + "-col-" + col}
                className={classNames(
                  "w-10 h-10 rounded inline-flex items-center justify-center cursor-pointer",
                  (boardState[row][col].state === SquareState.MISSED ||
                    boardState[row][col].state === SquareState.SHIP_HIT) &&
                    "bg-slate-200",
                  boardState[row][col].state === SquareState.SHIP_SUNK &&
                    "bg-slate-600",
                  boardState[row][col].state === SquareState.UNKNOWN &&
                    !isLoading &&
                    `bg-slate-200 p-1`,
                  boardState[row][col].state === SquareState.UNKNOWN &&
                    isLoading &&
                    `bg-slate-300 p-1 loading loading-${Math.round(
                      ((row + col) / boardSize) * 5
                    )}`,
                  !!possibleConfigs &&
                    possibleConfigs[row][col] === highestConfigurationCount &&
                    boardState[row][col].state === SquareState.UNKNOWN &&
                    highestConfigurationCount != 0 &&
                    "striped"
                )}
                onClick={() => {
                  const newState = [...boardState];
                  newState[row][col].state = nextSquareState(
                    boardState[row][col].state
                  );
                  setBoardState(newState);
                }}
                style={{
                  backgroundColor:
                    boardState[row][col].state === SquareState.UNKNOWN &&
                    possibleConfigs
                      ? `hsl(${
                          (possibleConfigs[row][col] /
                            (highestConfigurationCount || 1)) *
                          200
                        }, 90%, 48%)`
                      : undefined,
                }}
              >
                {boardState[row][col].state === SquareState.MISSED && (
                  <span className="border-4 border-slate-600 rounded-full w-6 h-6 inline-block"></span>
                )}
                {boardState[row][col].state === SquareState.SHIP_HIT && (
                  <span className="x-mark"></span>
                )}
                {!!possibleConfigs &&
                  showFullOutput &&
                  boardState[row][col].state === SquareState.UNKNOWN && (
                    <div className="text-white text-xs">
                      {possibleConfigs[row][col]}
                    </div>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={calculatePossibleConfigs}
        className="bg-cyan-500 hover:bg-cyan-600 text-white rounded p-2 mb-2 text-lg w-44 shadow-sm caps"
      >
        Calculate
      </button>
    </>
  );
};
