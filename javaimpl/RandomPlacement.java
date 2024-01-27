package javaimpl;

/**
 * This class is a defensive strategy which places its ships
 * randomly upon instantiation and then plays fair. <br>
 * I have not yet decided how this strategy determines a gameSate to use
 */
public class RandomPlacement extends DefensiveStrategy {

    private long shotSquares;
    private long allShips;
    private long[] ships;

    public RandomPlacement(int[] numberOfShips, int boardSize) {
        throw new RuntimeException("Not implemented");
    }

    @Override
    public int shootSquare(long square) {
        throw new RuntimeException("Not implemented");
    }
}
