package javaimpl.strategies;

import javaimpl.Utils;

/**
 * An offensive strategy is used by a ComputerPlayer to decide its next move
 */
public abstract class OffensiveStrategy {

    protected long miss;
    protected long hit;
    protected long sunk;

    public OffensiveStrategy() {
        this.miss = 0L;
        this.hit = 0L;
        this.sunk = 0L;
    }

    /**
     * This method is used to tell the strategy the outcome of its moves
     * @param square the square that was updated
     * @param state whether the square was a miss (0), hit (1) or sunk (2)
     */
    public void update(long square, int state) {
        if(state == 0) {
            miss |= square;
            return;
        }
        if(state == 1) {
            hit |= square;
            return;
        }

        long ship = Utils.getSunkShip(hit, square, 8);
        miss |= Utils.getBoundary(ship, 8);
        hit &= ~ship;
        sunk |= ship;
    }


    /**
     * This method returns the next move of this strategy
     * @return the square this strategy chooses
     */
    public abstract long getNextMove();
}
