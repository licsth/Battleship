package javaimpl.strategies;

import javaimpl.Utils;

/**
 * This class represents a fair defensive strategy where the ships are
 * specified in the beginning and then do not move.
 */
public abstract class FairDefense extends DefensiveStrategy {

    protected long ships;
    protected long shots;

    public FairDefense() {
        this.shots = 0L;
    }

    @Override
    public int shootSquare(long square) {
        shots |= square;
        if((ships & square) == 0L) return 0;
        long ship = Utils.getSunkShip(ships, square, 8);
        if((ship & shots) == ship) return 2;
        return 1;
    }

    @Override
    public boolean hasLost() {
        return (ships & ~shots) == 0L;
    }
}
