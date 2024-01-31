import { FunctionComponent } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { newGrid } from "../utilities/array";
import { Toggle } from "./Toggle";

interface Props {
  boardSize: number;
  onBoardSizeChange: (boardSize: number) => void;
  showFullOutput: boolean;
  setShowFullOutput: (showFullOutput: boolean) => void;
}

export const BoardSizeInputSection: FunctionComponent<Props> = ({
  boardSize,
  onBoardSizeChange,
  showFullOutput,
  setShowFullOutput,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 items-center gap-5">
        <div>
          <label className="block text-xs py-1 text-cyan-600">Board size</label>
          <input
            type="number"
            className="block shadow-sm p-1 text-center focus:ring-purple-500 focus:outline-none focus:ring-2 focus:border-transparent rounded w-20"
            min={1}
            step={1}
            value={boardSize}
            onChange={(e) => {
              if (!e.target.value) return;
              const newBoardSize = parseInt(e.target.value);
              onBoardSizeChange(newBoardSize);
            }}
          ></input>
        </div>
        <div>
          <label className="block text-xs py-1 text-cyan-600">
            Debug output
          </label>
          <Toggle value={showFullOutput} onChange={setShowFullOutput} />
        </div>
      </div>
    </>
  );
};
