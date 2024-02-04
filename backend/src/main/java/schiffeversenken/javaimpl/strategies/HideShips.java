package schiffeversenken.javaimpl.strategies;

/**
 * This Defensive strategy will only admit a hit if there is no other way.
 * When forced to admit a hit, it will only admit to a ship being sunk when forced to.
 * In particular, it cheats by having no predetermined state.
 * Instead, it moves its ships out of the way of shots.
 */
public class HideShips extends DefensiveStrategy {

    private long shots;

    public HideShips(int boardSize) {
        super();
    }
    @Override
    public int shootSquare(long square) {
        shots |= square;
        // this somehow needs access to the gameStates
        return 0;
    }

    @Override
    public boolean hasLost() {
        return false;
    }
}
