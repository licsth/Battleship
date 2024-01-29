package javaimpl;

/**
 * An offensive strategy is used by a ComputerPlayer to decide its next move
 */
public abstract class OffensiveStrategy {
    protected int boardSize;

    protected long miss;
    protected long hit;
    protected long sunk;

    public OffensiveStrategy(int boardSize) {
        this.boardSize = boardSize;
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

        long ship = getSunkShip(hit, square);
        miss |= Game.getBoundary(ship, boardSize);
        hit &= ~ship;
        sunk |= ship;
    }

    /**
     * This method returns for a given square and hits the ship that the square belongs to
     * @param hits the known hits
     * @param square the square
     * @return the ship that the square belongs to
     */
    public long getSunkShip(long hits, long square) {
        long ship = square;
        hits |= square;
        while((ship & hits) != 0) {
            hits &= ~ship;
            long shipUp = ship << boardSize & hits;
            long shipDown = ship >>> boardSize & hits;
            // leftMask is a mask that is 1 on all positions that are not on the left edge of the board
            long leftMask = 0xfefefefefefefefeL >>> (64 - boardSize);
            long shipLeft = (ship & ~leftMask) << 1 & hits;
            // rightMask is a mask that is 1 on all positions that are not on the right edge of the board
            long rightMask = 0x7f7f7f7f7f7f7f7fL >>> (64 - boardSize);
            long shipRight = (ship & ~rightMask) >>> 1 & hits;
            ship |= shipUp | shipDown | shipLeft | shipRight;
        }
        return ship;
    }

    /**
     * This method returns the next move of this strategy
     * @return the square this strategy chooses
     */
    public abstract long getNextMove();
}
