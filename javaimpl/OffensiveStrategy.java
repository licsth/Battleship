package javaimpl;

/**
 * An offensive strategy is used by a ComputerPlayer to decide its next move
 */
public abstract class OffensiveStrategy {
    protected int boardSize;

    public OffensiveStrategy(int boardSize) {
        this.boardSize = boardSize;
    }

    /**
     * Returns for a given state the next move this strategy would make
     * @param miss the missed shots
     * @param hit the hit ships
     * @param sunk the sunk ships
     * @return the square this strategy chooses
     */
    public abstract long getNextMove(long miss, long hit, long sunk);
}
