package schiffeversenken.javaimpl.players;

import schiffeversenken.javaimpl.strategies.HumanDefense;
import schiffeversenken.javaimpl.strategies.HumanOffense;

public class HumanPlayer extends Player {
    public HumanPlayer() {
        super(new HumanOffense(), new HumanDefense());
    }

    @Override
    public boolean isRobot() {
        return false;
    }
}
