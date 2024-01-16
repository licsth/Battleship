import { FunctionComponent } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { newGrid } from "../utilities/array";

interface Props {
  boardSize: number;
  setBoardSize: (boardSize: number) => void;
  setBoardState: (boardState: Board) => void;
  setPossibleConfigs: (possibleConfigs: number[][] | null) => void;
}

export const BoardSizeInputSection: FunctionComponent<Props> = ({
  boardSize,
  setBoardSize,
  setBoardState,
  setPossibleConfigs,
}) => {
  return (
    <>
      <label className="block text-xs py-1">Board size</label>
      <input
        type="number"
        className="block shadow-sm p-1 text-center focus:ring-cyan-500 focus:outline-none focus:ring-2 focus:border-transparent rounded w-20"
        min={1}
        step={1}
        value={boardSize}
        onChange={(e) => {
          if (!e.target.value) return;
          const newBoardSize = parseInt(e.target.value);
          setBoardSize(newBoardSize);
          setBoardState(
            newGrid(newBoardSize, newBoardSize, () => ({
              state: SquareState.UNKNOWN,
            }))
          );
          setPossibleConfigs(null);
        }}
      ></input>
    </>
  );
};
