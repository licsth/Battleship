package schiffeversenken.javaimpl.strategies;

import schiffeversenken.javaimpl.Utils;

/**
 * An offensive strategy is used by a ComputerPlayer to decide its next move
 */
public abstract class OffensiveStrategy {

    public Long nextMove;
    protected long miss;
    protected long hit;
    protected long sunk;

    public OffensiveStrategy() {
        nextMove = 0L;
        this.miss = 0L;
        this.hit = 0L;
        this.sunk = 0L;
    }

    /**
     * This method is used to tell the strategy the outcome of its moves
     * 
     * @param state whether the square was a miss (0), hit (1) or sunk (2)
     */
    public void update(int state) {
        if (state == 0) {
            miss |= nextMove;
        } else if (state == 1) {
            hit |= nextMove;
        } else {
            long ship = Utils.getSunkShip(hit, nextMove, 8);
            miss |= Utils.getBoundary(ship, 8);
            hit &= ~ship;
            sunk |= ship;
        }
        nextMove = 0L;
    }

    public abstract void computeNextMove();

}
