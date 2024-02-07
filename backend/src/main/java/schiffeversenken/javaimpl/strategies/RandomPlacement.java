package schiffeversenken.javaimpl.strategies;

import schiffeversenken.javaimpl.Game;
import schiffeversenken.javaimpl.Gamestates;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
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
     * 
     * @throws IOException
     * @throws FileNotFoundException
     */
    public RandomPlacement() throws FileNotFoundException, IOException {
        super();
        Random rnd = ThreadLocalRandom.current();
        int pos = rnd.nextInt(Gamestates.STATES_IN_STANDARD_8x8);
        RandomAccessFile raf = new RandomAccessFile(Game.GAME_STATES_FILENAME, "r");
        raf.seek(pos * Long.BYTES);
        this.ships = raf.readLong();
        raf.close();
    }
}
