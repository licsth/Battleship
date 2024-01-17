import { range } from "lodash";
import { FunctionComponent } from "react";

export const HeatMapLegend: FunctionComponent = () => {
  return (
    <div className="grid grid-cols-2">
      <div>
        <div
          style={{
            width: 55,
            height: 25,
          }}
          className="text-center text-xs text-white flex items-center justify-center striped"
        >
          highest
        </div>
        {range(200, -10, -10).map((num) => (
          <div
            style={{
              width: 55,
              height: 25,
              background: `hsl(${num}, 90%, 50%)`,
            }}
            key={"legend-" + num}
            className="text-center text-xs text-white flex items-center justify-center"
          >
            {(num === 0 && "low") || (num === 200 && "high")}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <div className="grid gri-cols-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="border-4 border-slate-600 rounded-full w-6 h-6 inline-block"></span>
            Missed
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="x-mark -ml-px"></span>
            Ship hit
          </div>
          <div className="flex items-center gap-3">
            <span className="h-6 w-6 bg-slate-600 rounded"></span>
            Ship sunk
          </div>
        </div>
      </div>
    </div>
  );
};
