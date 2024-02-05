package schiffeversenken.javaimpl;

import schiffeversenken.javaimpl.players.Player;
import schiffeversenken.javaimpl.strategies.HumanDefense;
import schiffeversenken.javaimpl.strategies.HumanOffense;

public class Game {
    Player p0;
    Player p1;
    boolean p0Next;

    public Game() {
        // TODO this should be its own thread
        //Gamestates gs = new Gamestates(false);
        //long[] states = gs.getAllStates();

        p0 = new Player(new HumanOffense(), new HumanDefense());
        // TODO wait until gameStates have been computed, then continue
        //p1 = new Player(new RandomGuesses(), new RandomPlacement(states));
        p0Next = true;

        runGame();
    }

    private void runGame() {
        Player activePlayer, inactivePlayer;
        do {
            activePlayer = getActivePlayer();
            inactivePlayer = getInactivePlayer();
            long square = activePlayer.getNextMove();
            int state = inactivePlayer.shootSquare(square);
            activePlayer.notify(state);
            p0Next = !p0Next;
        } while (!gameOver());

        // TODO display who won maybe?
        p0.gameOver();
        p1.gameOver();
    }

    private boolean gameOver() {
        return p0.hasLost() || p1.hasLost();
    }

    private Player getActivePlayer() {
        return p0Next ? p0 : p1;
    }

    private Player getInactivePlayer() {
        return p0Next ? p1 : p0;
    }
}
