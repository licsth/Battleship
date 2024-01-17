import { FunctionComponent } from "react";
import { ShipShape } from "../utilities/ship";
import { classNames } from "../utilities/classNames";
import { addSquareToShip } from "../utilities/addSquareToShip";

interface Props {
  ships: ShipShape[];
  setShips: (ships: ShipShape[]) => void;
  unsunkenShipIndices: number[];
}

export const ShipDisplay: FunctionComponent<Props> = ({
  ships,
  setShips,
  unsunkenShipIndices,
}) => {
  function addToShip(shipIndex: number, row: number, col: number) {
    let ship = ships[shipIndex];
    ship = addSquareToShip(ship, row, col);
    setShips([
      ...ships.slice(0, shipIndex),
      ship,
      ...ships.slice(shipIndex + 1),
    ]);
  }

  function deleteShip(shipIndex: number) {
    setShips([...ships.slice(0, shipIndex), ...ships.slice(shipIndex + 1)]);
  }

  return (
    <div className="">
      <p className="mb-6 mt-4 text-slate-600 text-xl text-center">Ships</p>
      {ships.map((ship, shipIndex) => (
        <div className="mb-3 flex items-center gap-7">
          <div>
            {[
              new Array(ship[0].length).fill(false),
              ...ship,
              new Array(ship[0].length).fill(false),
            ].map((row, i) => (
              <div key={`row-${i}`} className="mb-1">
                {[false, ...row, false].map((col, j) => {
                  const canAddHorizontal = !col && (row[j] || row[j - 2]);
                  const canAddVertical =
                    !col && (ship[i]?.[j - 1] || ship[i - 2]?.[j - 1]);
                  return (
                    <>
                      <div
                        key={`row-${i}-col-${j}`}
                        className={classNames(
                          "rounded inline-flex items-center mr-1 text-center justify-center align-middle",
                          col &&
                            (unsunkenShipIndices.includes(shipIndex)
                              ? "bg-purple-400"
                              : "bg-slate-600"),
                          canAddHorizontal &&
                            "bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer",
                          canAddVertical &&
                            "bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer",
                          "w-7 h-7 select-none"
                        )}
                        onClick={() => {
                          if (canAddHorizontal || canAddVertical) {
                            addToShip(shipIndex, i - 1, j - 1);
                          }
                        }}
                      >
                        {(canAddHorizontal || canAddVertical) && "+"}
                      </div>
                    </>
                  );
                })}
              </div>
            ))}
          </div>
          <div>
            <button
              onClick={() => deleteShip(shipIndex)}
              className="bg-red-500 hover:bg-red-600 text-white rounded py-1.5 px-3 mb-2 shadow-sm caps block text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          setShips([...ships, [[true]]]);
        }}
        className="bg-cyan-500 hover:bg-cyan-600 text-white rounded py-2 px-4 mb-2 shadow-sm caps block"
      >
        Add ship
      </button>
    </div>
  );
};
