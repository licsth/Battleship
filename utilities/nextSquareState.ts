import { SquareState } from "./boardState";

const stateOrder = [
  SquareState.UNKNOWN,
  SquareState.MISSED,
  SquareState.SHIP_HIT,
  SquareState.SHIP_SUNK,
];

export function nextSquareState(state: SquareState) {
  return stateOrder[
    (stateOrder.indexOf(state) + 1) %
    stateOrder.length
  ]
}