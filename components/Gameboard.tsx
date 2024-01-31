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
import {
  shapesEqualWithoutRotation,
  shipShapesEqual,
} from "../utilities/shipShapesEqual";
import { findSunkenShip } from "../utilities/findSunkenShip";
import { rotateShip } from "../utilities/rotateShip";
import { AnalysisBoard } from "./AnalysisBoard";
import { StupidDefenseBoard } from "./StupidDefenseBoard";

enum GameMode {
  ANALYSIS,
  STUPID_DEFENSIVE,
}

export const Gameboard: FunctionComponent = ({}) => {
  const [boardSize, setBoardSize] = useState<number>(5);
  const [showFullOutput, setShowFullOutput] = useState(false);
  const [computationTime, setComputationTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.STUPID_DEFENSIVE);

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

  return (
    <div className="grid grid-cols-3 bg-slate-100 font-mono">
      <div className="flex items-center pl-20">
        <HeatMapLegend />
      </div>
      <div className="h-screen flex flex-col items-center justify-center content-center p-5">
        <BoardSizeInputSection
          boardSize={boardSize}
          onBoardSizeChange={(newBoardSize) => {
            setBoardSize(newBoardSize);
            setBoardState(
              newGrid(newBoardSize, newBoardSize, () => ({
                state: SquareState.UNKNOWN,
              }))
            );
            setPossibleConfigs(null);
          }}
          showFullOutput={showFullOutput}
          setShowFullOutput={setShowFullOutput}
        />
        <div className="flex flex-col items-center justify-center content-center flex-grow">
          {gameMode === GameMode.ANALYSIS && (
            <AnalysisBoard
              showFullOutput={showFullOutput}
              isLoading={isLoading}
              possibleConfigs={possibleConfigs}
              boardState={boardState}
              setBoardState={setBoardState}
              setComputationTime={setComputationTime}
              unsunkenShips={unsunkenShips}
              setPossibleConfigs={setPossibleConfigs}
            />
          )}
          {gameMode === GameMode.STUPID_DEFENSIVE && (
            <StupidDefenseBoard
              boardState={boardState}
              setBoardState={setBoardState}
              unsunkenShips={unsunkenShips}
            />
          )}
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
          <div className="mt-5 text-center text-slate-600 text-[10px]">
            {showFullOutput && computationTime != null && (
              <span>Computation time: {computationTime}ms</span>
            )}
          </div>
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
