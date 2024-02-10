package schiffeversenken.javaimpl.players;

import schiffeversenken.javaimpl.strategies.DefensiveStrategy;
import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

/**
 * This class represents a Player. The Player has an offensive
 * and a defensive strategy that it uses to determine how it plays. <br>
 * A Player is also a Thread that runs independently of the game.
 * This has the advantage that a Player can compute their next move
 * immediately after being notified of the last moves result. In particular,
 * it can compute the next move during the opponents turn, which makes it
 * appear much faster than it is.
 */
public class Player {

    private final OffensiveStrategy offensiveStrategy;
    private final DefensiveStrategy defensiveStrategy;

    public Player(OffensiveStrategy offensiveStrategy, DefensiveStrategy defensiveStrategy) {
        this.offensiveStrategy = offensiveStrategy;
        this.defensiveStrategy = defensiveStrategy;
        offensiveStrategy.computeNextMove();
    }

    /**
     * This method is used to notify this player of the result of their last move.
     * 
     * @param state the state of the square (miss (0), hit (1), or sunk (2))
     */
    public void notify(int state) {
        offensiveStrategy.update(state);
    }

    /**
     * This method is used to tell this Player which square the opponent shot at.
     * It returns whether the shot was a miss (0), hit (1) or sunk (2)
     * 
     * @param square the square that was shot
     * @return the state
     */
    public int shootSquare(long square) {
        return defensiveStrategy.shootSquare(square);
    }

    /**
     * This method returns the next move this player wants to make.
     * When the player has not yet chosen, it waits until they do.
     * 
     * @return the next move this player would like to make.
     */
    public long getNextMove() {
        offensiveStrategy.computeNextMove();
        return offensiveStrategy.nextMove;
    }

    public boolean hasLost() {
        return defensiveStrategy.hasLost();
    }

}
