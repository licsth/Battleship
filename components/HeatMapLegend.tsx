import { range } from "lodash";
import { FunctionComponent } from "react";

export const HeatMapLegend: FunctionComponent = () => {
  return (
    <div>
      <div
        style={{
          width: 50,
          height: 25,
        }}
        className="text-center text-xs text-white flex items-center justify-center striped"
      >
        highest
      </div>
      {range(200, -10, -10).map((num) => (
        <div
          style={{
            width: 50,
            height: 25,
            background: `hsl(${num}, 90%, 50%)`,
          }}
          className="text-center text-xs text-white flex items-center justify-center"
        >
          {(num === 0 && "low") || (num === 200 && "high")}
        </div>
      ))}
    </div>
  );
};
