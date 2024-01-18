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
import { shipShapesEqual } from "../utilities/shipShapesEqual";
import { findSunkenShip } from "../utilities/findSunkenShip";

export const Gameboard: FunctionComponent = ({}) => {
  const [boardSize, setBoardSize] = useState<number>(5);
  const [showNumbers, setShowNumbers] = useState(false);

  const [boardState, setBoardState] = useState<Board>(
    newGrid(boardSize, boardSize, () => ({ state: SquareState.UNKNOWN }))
  );

  const [ships, setShips] = useState<ShipShape[]>([
    [[true, true]],
    [[true, true]],
    [[true, true, true]],
  ]);

  const unsunkenShipIndices = useMemo(() => {
    let indices = range(ships.length);

    const boardStateCopy = boardState.map((row) =>
      row.map((col) => ({ ...col }))
    );
    let sunkenShip: ShipShape | null = null;
    while ((sunkenShip = findSunkenShip(boardStateCopy)) != null) {
      const shipIndex = ships.findIndex(
        (ship, index) =>
          indices.includes(index) &&
          shipShapesEqual(sunkenShip as ShipShape, ship)
      );
      indices = indices.filter((index) => index !== shipIndex);
    }
    return indices;
  }, [ships, boardState]);

  const unsunkenShips = useMemo(() => {
    return ships.filter((_, index) => unsunkenShipIndices.includes(index));
  }, [unsunkenShipIndices]);

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

  function calculatePossibleConfigs() {
    setPossibleConfigs(possibleConfigurations(boardState, unsunkenShips));
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
          showNumbers={showNumbers}
          setShowNumbers={setShowNumbers}
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
                        "bg-slate-200 p-1",
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
                      showNumbers &&
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
        <ShipDisplay
          ships={ships}
          setShips={setShips}
          unsunkenShipIndices={unsunkenShipIndices}
        />
      </div>
    </div>
  );
};
