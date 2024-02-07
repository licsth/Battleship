package schiffeversenken.javaimpl;

import java.io.FileNotFoundException;
import java.io.IOException;

import schiffeversenken.javaimpl.players.Player;
import schiffeversenken.javaimpl.strategies.*;

public class Game {

    public static final String GAME_STATES_FILENAME = "gamestates.bin";

    Player human;
    Player computer;
    boolean humanNext;

    public Game() throws FileNotFoundException, IOException {
        // TODO this method is supposed to be called by the start button
        // TODO this method needs to be passed the Strategies of the computer and apply
        // them

        if (false) { // Test whether strategies actually need to know all states
            long[] states = Utils.readStatesFromFile();
        }
        human = new Player(new HumanOffense(), new HumanDefense());
        computer = new Player(new RandomGuesses(), new RandomPlacement());
        humanNext = true;
    }

    // private void runGame() {
    // Player activePlayer, inactivePlayer;
    // do {
    // activePlayer = getActivePlayer();
    // inactivePlayer = getInactivePlayer();
    // long square = activePlayer.getNextMove();
    // int state = inactivePlayer.shootSquare(square);
    // activePlayer.notify(state);
    // humanNext = !humanNext;
    // } while (!gameOver());

    // // TODO display who won maybe?
    // human.gameOver();
    // computer.gameOver();
    // }

    public boolean gameOver() {
        return human.hasLost() || computer.hasLost();
    }

    private Player getActivePlayer() {
        return humanNext ? human : computer;
    }

    private Player getInactivePlayer() {
        return humanNext ? computer : human;
    }
}
