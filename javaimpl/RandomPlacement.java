package javaimpl;

import java.io.RandomAccessFile;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * This class is a defensive strategy which places its ships
 * randomly upon instantiation and then plays fair. <br>
 * I have not yet decided how this strategy determines a gameSate to use
 */
public class RandomPlacement extends DefensiveStrategy {

    private long ships;
    private long shots;

    /**
     * Constructs a RandomPlacement Defensive Strategy.
     * Only works for ships of sizes 1x1, 1x2, 1x3, 1x4.
     * @param numberOfShips numberOfShips[i] specifies how many (i-1)-by-x ships are to be placed
     * @param boardSize the board size
     */
    public RandomPlacement(int[] numberOfShips, int boardSize) {
        super(boardSize);
        try(RandomAccessFile raf = new RandomAccessFile("gamestates.bin", "r")) {
            Random rnd = ThreadLocalRandom.current();
            int pos = rnd.nextInt(Gamestates.STATES_IN_STANDARD_8x8);
            raf.seek((long) (pos - 1) * Long.BYTES);
            this.ships = raf.readLong();
            this.shots = 0L;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public int shootSquare(long square) {
        shots |= square;
        if((ships & square) == 0L) return 0;
        long ship = OffensiveStrategy.getSunkShip(ships, square, boardSize);
        if((ship & shots) == ship) return 2;
        return 1;
    }
}
