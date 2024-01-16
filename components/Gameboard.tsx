import { FunctionComponent, useEffect, useState } from "react";
import React from "react";
import { Board, SquareState } from "../utilities/boardState";
import { ShipShape } from "../utilities/ship";
import { possibleConfigurations } from "../utilities/bestGuess";
import { range } from "lodash";
import { classNames } from "../utilities/classNames";

export const Gameboard: FunctionComponent = ({}) => {
  const boardSize = 8;
  const [boardState, setBoardState] = useState<Board>(
    new Array(boardSize)
      .fill(new Array(boardSize).fill(0))
      .map((row) => row.map(() => ({ state: SquareState.UNKNOWN })))
  );

  const [ships, setShips] = useState<ShipShape[]>([
    [[true, true]],
    [[true, true]],
    [[true, true]],
    [[true, true, true]],
    [[true, true, true]],
    [[true, true, true]],
    [[true, true, true, true]],
    // [[true, true, true]],
  ]);
  const [possibleConfigs, setPossibleConfigs] = useState<number[][] | null>(
    null
  );

  const stateOrder = [
    SquareState.UNKNOWN,
    SquareState.MISSED,
    SquareState.SHIP_HIT,
    SquareState.SHIP_SUNK,
  ];

  function calculatePossibleConfigs() {
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
              console.log("splice", lengthCount, row, col);
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
    <div className="flex items-center justify-center content-center h-screen bg-slate-50 gap-5">
      <div className="block">
        {range(boardSize).map((row) => (
          <div className="flex flex-row gap-1 mb-1">
            {range(boardSize).map((col) => (
              <div
                className={classNames(
                  "w-10 h-10 rounded inline-flex items-center justify-center",
                  boardState[row][col].state !== SquareState.SHIP_HIT &&
                    boardState[row][col].state !== SquareState.SHIP_SUNK &&
                    "bg-slate-200",
                  boardState[row][col].state === SquareState.SHIP_HIT &&
                    "bg-red-600",
                  boardState[row][col].state === SquareState.SHIP_SUNK &&
                    "bg-slate-600"
                )}
                onClick={() => {
                  const newState = [...boardState];
                  newState[row][col].state =
                    stateOrder[
                      (stateOrder.indexOf(boardState[row][col].state) + 1) %
                        stateOrder.length
                    ];
                  setBoardState(newState);
                }}
              >
                {boardState[row][col].state === SquareState.MISSED && (
                  <span className="border-4 border-slate-600 rounded-full w-6 h-6 inline-block"></span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={calculatePossibleConfigs}>Go</button>
      <div className="block">
        {possibleConfigs &&
          range(boardSize).map((row) => (
            <div className="flex flex-row gap-1 mb-1">
              {range(boardSize).map((col) => (
                <div
                  className={classNames(
                    "w-10 h-10 rounded inline-flex items-center justify-center"
                  )}
                >
                  {possibleConfigs[row][col]}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
