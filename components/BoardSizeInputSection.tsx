import { FunctionComponent } from "react";
import { Toggle } from "./Toggle";
import { GameMode } from "./Gameboard";

interface Props {
  boardSize: number;
  onBoardSizeChange: (boardSize: number) => void;
  showFullOutput: boolean;
  setShowFullOutput: (showFullOutput: boolean) => void;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
}

export const BoardSizeInputSection: FunctionComponent<Props> = ({
  boardSize,
  onBoardSizeChange,
  showFullOutput,
  setShowFullOutput,
  gameMode,
  setGameMode,
}) => {
  return (
    <>
      <div className="flex items-center gap-5">
        <div>
          <label className="block text-xs py-1 text-cyan-600">Game mode</label>
          <select
              className="text-xs p-2 shadow-sm rounded"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value as unknown as GameMode)}
          >
            <option value={GameMode.ANALYSIS}>Analysis</option>
            <option value={GameMode.STUPID_DEFENSIVE}>Mobbing</option>
            <option value={GameMode.JAVA_8x8}>Computer</option>
          </select>
        </div>
        {gameMode !== GameMode.JAVA_8x8 ? <div>
        <label className="block text-xs py-1 text-cyan-600">Board size</label>
          <input
              type="number"
              className="block shadow-sm p-1 text-center focus:ring-purple-500 focus:outline-none focus:ring-2 focus:border-transparent rounded w-20"
              min={1}
              step={1}
              value={boardSize}
              onChange={(e) => {
                const value = (e.target.value && parseInt(e.target.value)) || 0;
                const newBoardSize = value;
                onBoardSizeChange(newBoardSize);
              }}
          ></input>
        </div> : null}
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
