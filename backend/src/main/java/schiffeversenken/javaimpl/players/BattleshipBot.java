package schiffeversenken.javaimpl.players;

import schiffeversenken.javaimpl.strategies.DefensiveStrategy;
import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

public class BattleshipBot extends Player {

    public BattleshipBot(OffensiveStrategy offensiveStrategy, DefensiveStrategy defensiveStrategy) {
        super(offensiveStrategy, defensiveStrategy);
    }

    @Override
    public boolean isRobot() {
        return true;
    }
}
