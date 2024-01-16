export interface Ship {
  shape: ShipShape;
  position: [number, number];
  orientation: Orientation;
}

export type ShipShape = boolean[][];

export enum Orientation {
  VERTICAL,
  HORIZONTAL
}
