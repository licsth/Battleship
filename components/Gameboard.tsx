import { FunctionComponent, useEffect, useMemo, useState } from "react";
import React from "react";
import { Board, SquareState } from "../utilities/boardState";
import { ShipShape } from "../utilities/ship";
import { possibleConfigurations } from "../utilities/bestGuess";
import { range } from "lodash";
import { classNames } from "../utilities/classNames";
import { newGrid } from "../utilities/array";
import { BoardSizeInputSection } from "./BoardSizeInputSection";
import { nextSquareState } from "../utilities/nextSquareState";
import { HeatMapLegend } from "./HeatMapLegend";
import { ShipDisplay } from "./ShipDisplay";

export const Gameboard: FunctionComponent = ({}) => {
  const [boardSize, setBoardSize] = useState<number>(5);

  const [boardState, setBoardState] = useState<Board>(
    newGrid(boardSize, boardSize, () => ({ state: SquareState.UNKNOWN }))
  );

  const [ships, setShips] = useState<ShipShape[]>([
    [[true, true]],
    [[true, true]],
    [[true, true, true]],
  ]);
  const [possibleConfigs, setPossibleConfigs] = useState<number[][] | null>(
    null
  );
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

  console.log(possibleConfigs, highestConfigurationCount);

  function calculatePossibleConfigs() {
    // TODO remove ships from consideration set on board state edit & display in ship display
    // TODO check equality of ship shape instead of just length
    let consideredShips = [...ships].filter((ship) => ship.length > 0);

    const boardStateCopy = boardState.map((row) =>
      row.map((col) => ({ ...col }))
    );
    let lengthCount = 0;
    for (let row = 0; row < boardStateCopy.length; row++) {
      for (let col = 0; col < boardStateCopy[row].length; col++) {
        lengthCount = 0;
        while (
          col + lengthCount < boardStateCopy[row].length &&
          boardStateCopy[row][col + lengthCount].state === SquareState.SHIP_SUNK
        ) {
          boardStateCopy[row][col + lengthCount].state = SquareState.MISSED;
          lengthCount++;
        }
        while (
          row + lengthCount < boardStateCopy.length &&
          boardStateCopy[row + lengthCount][col].state === SquareState.SHIP_SUNK
        ) {
          boardStateCopy[row + lengthCount][col].state = SquareState.MISSED;
          lengthCount++;
        }
        if (lengthCount > 0) {
          // console.log(boardStateCopy.map((row) => row.map((col) => col.state)));
          for (let i = 0; i < consideredShips.length; i++) {
            if (
              consideredShips[i].length === lengthCount &&
              consideredShips[i][0].length === 1
            ) {
              consideredShips = consideredShips.filter(
                (_, index) => index !== i
              );
              break;
            } else if (
              consideredShips[i].length === 1 &&
              consideredShips[i][0].length === lengthCount
            ) {
              consideredShips = consideredShips.filter(
                (_, index) => index !== i
              );
              break;
            }
          }
        }
      }
    }
    console.log(consideredShips);
    setPossibleConfigs(possibleConfigurations(boardState, consideredShips));
  }

  return (
    <div className="grid grid-cols-3 bg-slate-100 font-mono">
      <div className="flex items-center pl-20">
        <HeatMapLegend />
      </div>
      <div className="h-screen flex flex-col items-center justify-center content-center p-5">
        <BoardSizeInputSection
          boardSize={boardSize}
          setBoardSize={setBoardSize}
          setBoardState={setBoardState}
          setPossibleConfigs={setPossibleConfigs}
        />
        <div className="flex flex-col items-center justify-center content-center flex-grow">
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
                        "bg-slate-200",
                      !!possibleConfigs &&
                        possibleConfigs[row][col] ===
                          highestConfigurationCount &&
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
                            }, 90%, 50%)`
                          : undefined,
                    }}
                  >
                    {boardState[row][col].state === SquareState.MISSED && (
                      <span className="border-4 border-slate-600 rounded-full w-6 h-6 inline-block"></span>
                    )}
                    {boardState[row][col].state === SquareState.SHIP_HIT && (
                      <span className="x-mark"> </span>
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
          <button
            onClick={() => {
              setBoardState(
                newGrid(boardSize, boardSize, () => ({
                  state: SquareState.UNKNOWN,
                }))
              );
              setPossibleConfigs(null);
            }}
            className="bg-purple-400 hover:bg-purple-500 text-white rounded p-2 text-xs w-44 shadow-sm"
          >
            Reset board
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <ShipDisplay ships={ships} setShips={setShips} />
      </div>
    </div>
  );
};
