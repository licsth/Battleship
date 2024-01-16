export type Board = Square[][];

interface Square {
  state: SquareState;
}

export enum SquareState {
  UNKNOWN,
  SHIP_HIT,
  SHIP_SUNK,
  MISSED
}