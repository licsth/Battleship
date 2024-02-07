import { FunctionComponent } from "react";
import { ShipShape } from "../utilities/ship";
import { classNames } from "../utilities/classNames";

interface Props {
  ships: ShipShape[];
  unsunkenShipIndices: number[];
}

export const JavaShipDisplay: FunctionComponent<Props> = ({
  ships,
  unsunkenShipIndices,
}) => {
  return (
    <div className="" style={{ display: "flex", flexDirection: "row" }}>
      <p className="mb-6 mt-4 mr-10 text-slate-600 text-xl">Ships:</p>
      {ships.map((ship, shipIndex) => (
        <div className="mr-5 flex items-center gap-7" key={`ship-${shipIndex}`}>
          {ship.map((row, i) => (
            <div key={`row-${i}`} className="mb-[3px]">
              {row.map((col, j) => {
                return (
                  <div
                    key={`row-${i}-col-${j}`}
                    className={classNames(
                      "rounded inline-flex items-center mr-[3px] text-center justify-center align-middle",
                      col &&
                        (unsunkenShipIndices.includes(shipIndex)
                          ? "bg-purple-400"
                          : "bg-slate-600"),
                      "w-6 h-6 select-none"
                    )}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
