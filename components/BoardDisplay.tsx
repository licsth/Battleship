import { range } from "lodash";
import { FunctionComponent } from "react";
import { Board, SquareState } from "../utilities/boardState";
import { classNames } from "../utilities/classNames";

interface Props {
  boardState: Board;
  isLoading?: boolean;
  onFieldClick: (row: number, col: number) => void;
  getFieldBackgroundColor?: (row: number, col: number) => string | undefined;
  fieldIsStriped?: (row: number, col: number) => boolean;
  fieldContent?: (row: number, col: number) => JSX.Element | null;
}

export const BoardDisplay: FunctionComponent<Props> = ({
  boardState,
  isLoading,
  onFieldClick,
  getFieldBackgroundColor,
  fieldIsStriped,
  fieldContent,
}) => {
  const boardSize = boardState.length;

  return (
    <>
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
                fieldIsStriped?.(row, col) && "striped"
              )}
              onClick={() => {
                onFieldClick(row, col);
              }}
              style={{
                backgroundColor: getFieldBackgroundColor?.(row, col),
              }}
            >
              {boardState[row][col].state === SquareState.MISSED && (
                <span className="border-4 border-slate-600 rounded-full w-6 h-6 inline-block"></span>
              )}
              {boardState[row][col].state === SquareState.SHIP_HIT && (
                <span className="x-mark"></span>
              )}
              {fieldContent?.(row, col)}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
