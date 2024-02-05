package schiffeversenken.javaimpl.strategies;

/**
 * This Defensive strategy will only admit a hit if there is no other way.
 * When forced to admit a hit, it will only admit to a ship being sunk when forced to.
 * In particular, it cheats by having no predetermined state.
 * Instead, it moves its ships out of the way of shots.
 */
public class HideShips extends DefensiveStrategy {

    private long[] states;

    public HideShips(long[] states) {
        super();
        this.states = states;
    }
    @Override
    public int shootSquare(long square) {
        // TODO copy... I mean adapt Lindas code but make it bitwise

        return 0;
    }

    @Override
    public boolean hasLost() {
        return false;
    }
}
