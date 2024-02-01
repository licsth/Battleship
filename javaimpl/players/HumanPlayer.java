package javaimpl.players;

import javaimpl.strategies.HumanDefense;
import javaimpl.strategies.HumanOffense;

public class HumanPlayer extends Player {
    public HumanPlayer() {
        super(new HumanOffense(), new HumanDefense());
    }

    @Override
    public boolean isRobot() {
        return false;
    }
}
