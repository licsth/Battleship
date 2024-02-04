package schiffeversenken.javaimpl;

import schiffeversenken.javaimpl.players.BattleshipBot;
import schiffeversenken.javaimpl.players.HumanPlayer;
import schiffeversenken.javaimpl.players.Player;
import schiffeversenken.javaimpl.strategies.RandomGuesses;
import schiffeversenken.javaimpl.strategies.RandomPlacement;

public class Game {
    Player p0;
    Player p1;
    boolean p0Next;

    public Game() {
        // first, all valid states are computed
        Gamestates gs = new Gamestates(false);
        long[] states = gs.getAllStates();
        // when HumanPlayer is instantiated, the player also chooses their setup
        p0 = new HumanPlayer();
        p1 = new BattleshipBot(new RandomGuesses(), new RandomPlacement(states));
        p0Next = true;

        runGame();
    }

    private void runGame() {
        Player activePlayer, inactivePlayer;
        do {
            activePlayer = getActivePlayer();
            inactivePlayer = getInactivePlayer();
            if(activePlayer.isRobot()) {
                long square = activePlayer.getNextMove();
                int state = inactivePlayer.shootSquare(square);
                activePlayer.notify(square, state);
                p0Next = !p0Next;
            } else {
                // TODO I dont actually know how this works
            }
        } while (!gameOver());
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
