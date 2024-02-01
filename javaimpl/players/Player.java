package javaimpl.players;

import javaimpl.strategies.DefensiveStrategy;
import javaimpl.strategies.OffensiveStrategy;

/**
 * This class represents a Player. The Player has an offensive
 * and a defensive strategy that it uses to determine how it plays
 */
public abstract class Player {

    private final OffensiveStrategy offensiveStrategy;
    private final DefensiveStrategy defensiveStrategy;

    public Player(OffensiveStrategy offensiveStrategy, DefensiveStrategy defensiveStrategy) {
        this.offensiveStrategy = offensiveStrategy;
        this.defensiveStrategy = defensiveStrategy;
    }

    /**
     * This method returns the next move this player wants to make.
     * @return the square this player shoots
     */
    public long getNextMove() {
        return offensiveStrategy.getNextMove();
    }

    /**
     * This method is used to notify this player of the result of their last move
     * @param square the square that was shot
     * @param state the state of the square (miss (0), hit (1), or sunk (2))
     */
    public void notify(long square, int state) {
        offensiveStrategy.update(square, state);
    }

    /**
     * This method is used to tell this Player which square the opponent shot at.
     * It returns whether the shot was a miss (0), hit (1) or sunk (2)
     * @param square the square that was shot
     * @return the state
     */
    public int shootSquare(long square) {
        return defensiveStrategy.shootSquare(square);
    }

    public abstract boolean isRobot();

    public boolean hasLost() {
        return defensiveStrategy.hasLost();
    }
}
