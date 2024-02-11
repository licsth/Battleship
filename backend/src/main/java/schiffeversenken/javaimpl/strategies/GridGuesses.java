package schiffeversenken.javaimpl.strategies;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * This offensive strategy guesses squares in a grid.
 * Whenever it hits a ship, it will test the four surrounding squares until it
 * finds the ship.
 * It can be determined whether it tries the grid in a random order or left to
 * right.
 */
public class GridGuesses extends OffensiveStrategy {

    private final boolean rnd;

    // whether we currently target a specific ship
    private boolean targeting;

    // the square we hit first when targeting == true
    private long hitSquare;

    // the direction we currently try encoded as offset: 1 for horizontal, 8 for
    // vertical
    private int direction;

    private List<Long> grid;

    public GridGuesses(boolean rnd) {
        this.rnd = rnd;
        this.targeting = false;
        this.hitSquare = 0L;
        this.direction = 0;
        // initiate grid to 0,2,4,6, 9,11,13,15, 16,18,20,22, 25,27,29,31, 32,34,36,38, 41,43,45,47, 48,50,52,54, 57,59,61,63
        this.grid = IntStream.range(0,64).filter(i -> (i/8)%2==0 ? i % 2 == 0 : i % 2 == 1).boxed().map(i -> 1L << i).collect(Collectors.toList());
        if (rnd) {
            Collections.shuffle(grid);
        }
    }

    @Override
    public void computeNextMove() {
        // shoot grid pattern
        if (!targeting) {
            this.nextMove = getNextGridShot();
        }

        // TODO implement

    }

    @Override
    public void update(int state) {
        super.update(state);
        switch (state) {
            case 0:
                // TODO handle
                break;
            case 1:
                // TODO handle
                targeting = true;
                break;
            case 2:
                // TODO handle
                targeting = false;
                break;
            default:
                throw new IllegalArgumentException("The state " + state + " is not valid.");
        }
        // TODO this is supposed to do something different here
    }

    private long getNextGridShot() {
        long square = grid.remove(0);
        while ((square & (this.miss | this.hit | this.sunk)) != 0L) {
            square = grid.remove(0);
        }
        return square;
    }
}
