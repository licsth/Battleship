package javaimpl;

public abstract class DefensiveStrategy {

    protected int boardSize;
    protected long hits;
    protected long miss;
    protected long sunk;

    public DefensiveStrategy(int boardSize) {
        this.boardSize = boardSize;
    }

    /**
     * This method returns whether a square is a miss (0), hit (1) or sunk (2).
     * @param square the square that was shot
     * @return whether the square was a hit, miss or sunk
     */
    public abstract int shootSquare(long square);
}
