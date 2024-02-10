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
    private long hitSqaure;

    // the direction we currently try encoded as offset: 1 for horizontal, 8 for
    // vertical
    private int direction;

    private List<Long> grid;

    public GridGuesses(boolean rnd) {
        this.rnd = rnd;
        this.targeting = false;
        this.hitSqaure = 0L;
        this.direction = 0;
        this.grid = IntStream.range(0, 32)
                .boxed()
                .map(i -> 1L << (2 * i))
                .collect(Collectors.toList());
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
            case 1:
                // TODO handle
                targeting = true;
            case 2:
                // TODO handle
                targeting = false;
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
