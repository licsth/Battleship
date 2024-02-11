import { FunctionComponent, useMemo } from 'react';
import { Board, SquareState } from '../utilities/boardState';
import { nextSquareState } from '../utilities/nextSquareState';
import { rotateShip } from '../utilities/rotateShip';
import { ShipShape } from '../utilities/ship';
import { possibleConfigurations } from '../utilities/bestGuess';
import { shapesEqualWithoutRotation } from '../utilities/shipShapesEqual';
import { BoardDisplay } from './BoardDisplay';

interface Props {
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
        true,
      ),
    );
    setComputationTime(Date.now() - time);
  }

  const highestConfigurationCount = useMemo(() => {
    if (!possibleConfigs) return 0;
    return Math.max(
      ...possibleConfigs.map((row, i) =>
        Math.max(
          ...row.map((col, j) =>
            boardState[i][j].state === SquareState.UNKNOWN ? col : 0,
          ),
        ),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [possibleConfigs]);

  return (
    <>
      <div className="block mb-5">
        <BoardDisplay
          boardState={boardState}
          isLoading={isLoading}
          onFieldClick={(row, col) => {
            const newState = [...boardState];
            newState[row][col].state = nextSquareState(
              boardState[row][col].state,
            );
            setBoardState(newState);
          }}
          fieldIsStriped={(row, col) =>
            possibleConfigs?.[row]?.[col] === highestConfigurationCount &&
            highestConfigurationCount !== 0 &&
            boardState[row][col].state === SquareState.UNKNOWN
          }
          getFieldBackgroundColor={(row, col) => {
            if (
              boardState[row][col].state !== SquareState.UNKNOWN ||
              !possibleConfigs
            ) {
              return undefined;
            }
            return `hsl(${
              (possibleConfigs[row][col] / (highestConfigurationCount || 1)) *
              200
            }, 90%, 48%)`;
          }}
          fieldContent={(row, col) => {
            if (
              !possibleConfigs ||
              !showFullOutput ||
              boardState[row][col].state !== SquareState.UNKNOWN
            ) {
              return null;
            }
            return (
              <div className="text-white text-xs">
                {possibleConfigs[row][col]}
              </div>
            );
          }}
        />
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
