package schiffeversenken.javaimpl.strategies;
import schiffeversenken.javaimpl.Gamestates;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * This class is a defensive strategy which places its ships
 * randomly upon instantiation and then plays fair. <br>
 * I have not yet decided how this strategy determines a gameSate to use
 */
public class RandomPlacement extends FairDefense {

    /**
     * Constructs a RandomPlacement Defensive Strategy.
     */
    public RandomPlacement(long[] states) {
        super();
        Random rnd = ThreadLocalRandom.current();
        int pos = rnd.nextInt(Gamestates.STATES_IN_STANDARD_8x8);
        this.ships = states[pos];
    }
}
