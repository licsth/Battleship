import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Board, SquareState } from '../utilities/boardState';
import { ShipShape } from '../utilities/ship';
import { newGrid } from '../utilities/array';
import { classNames } from '../utilities/classNames';
import { getUnsunkenShipIndicesInBoardState } from '../utilities/getUnsunkShipIndicesInBoardState';
import { BoardSizeInputSection } from './BoardSizeInputSection';
import { HeatMapLegend } from './HeatMapLegend';
import { ShipDisplay } from './ShipDisplay';
import { AnalysisBoard } from './AnalysisBoard';
import { StupidDefenseBoard } from './StupidDefenseBoard';
import { JavaBoard } from './JavaBoard';
import { NiceBoard } from './NiceBoard';

export enum GameMode {
  ANALYSIS = 'analysis',
  STUPID_DEFENSIVE = 'stupid_defensive',
  NICE_DEFENSIVE = 'nice_defensive',
  JAVA_8x8 = 'java_8x8',
}

export const Gameboard: FunctionComponent = ({}) => {
  const [showFullOutput, setShowFullOutput] = useState(false);
  const [computationTime, setComputationTime] = useState<number | null>(null);
  const [isLoading] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.ANALYSIS);
  const [boardSize, setBoardSize] = useState<number>(5);

  const [boardState, setBoardState] = useState<Board>(
    newGrid(boardSize, boardSize, () => ({ state: SquareState.UNKNOWN })),
  );

  const [ships, setShips] = useState<ShipShape[]>([
    [[true, true]],
    [[true, true]],
    [[true, true, true]],
  ]);

  const unsunkenShipIndices = useMemo(
    () => getUnsunkenShipIndicesInBoardState(boardState, ships),
    [ships, boardState],
  );

  const unsunkenShips = useMemo(() => {
    return ships.filter((_, index) => unsunkenShipIndices.includes(index));
  }, [unsunkenShipIndices, ships]);

  const [possibleConfigs, setPossibleConfigs] = useState<number[][] | null>(
    null,
  );

  useEffect(() => {
    const newBoardSize = gameMode === GameMode.JAVA_8x8 ? 8 : 5;
    setBoardSize(newBoardSize);
    setBoardState(
      newGrid(newBoardSize, newBoardSize, () => ({
        state: SquareState.UNKNOWN,
      })),
    );
  }, [gameMode]);

  return (
    <div
      className={classNames(
        'grid bg-slate-100 font-mono',
        gameMode === GameMode.ANALYSIS && 'grid-cols-3',
        gameMode === GameMode.STUPID_DEFENSIVE && 'grid-cols-2',
        gameMode === GameMode.NICE_DEFENSIVE && 'grid-cols-2',
        gameMode === GameMode.JAVA_8x8 && 'grid-cols-1',
      )}
    >
      {gameMode === GameMode.ANALYSIS && (
        <div className="flex items-center pl-20">
          <HeatMapLegend />
        </div>
      )}
      <div className="h-screen flex flex-col items-center justify-center content-center p-5">
        <BoardSizeInputSection
          boardSize={boardSize}
          onBoardSizeChange={(newBoardSize) => {
            setBoardSize(newBoardSize);
            setBoardState(
              newGrid(newBoardSize, newBoardSize, () => ({
                state: SquareState.UNKNOWN,
              })),
            );
            setPossibleConfigs(null);
          }}
          showFullOutput={showFullOutput}
          setShowFullOutput={setShowFullOutput}
          gameMode={gameMode}
          setGameMode={setGameMode}
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
          {gameMode === GameMode.NICE_DEFENSIVE && (
            <NiceBoard
              boardState={boardState}
              setBoardState={setBoardState}
              unsunkenShips={unsunkenShips}
            />
          )}
          {gameMode === GameMode.JAVA_8x8 && <JavaBoard />}
          {gameMode !== GameMode.JAVA_8x8 && (
            <button
              onClick={() => {
                setBoardState(
                  newGrid(boardSize, boardSize, () => ({
                    state: SquareState.UNKNOWN,
                  })),
                );
                setPossibleConfigs(null);
              }}
              className="bg-purple-400 hover:bg-purple-500 text-white rounded p-2 text-xs w-44 shadow-sm"
            >
              Reset board
            </button>
          )}
          <div className="mt-5 text-center text-slate-600 text-[10px]">
            {showFullOutput && computationTime != null && (
              <span>Computation time: {computationTime}ms</span>
            )}
          </div>
        </div>
      </div>
      {gameMode !== GameMode.JAVA_8x8 && (
        <div className="flex items-center justify-center">
          <ShipDisplay
            ships={ships}
            setShips={setShips}
            unsunkenShipIndices={unsunkenShipIndices}
          />
        </div>
      )}
    </div>
  );
};
