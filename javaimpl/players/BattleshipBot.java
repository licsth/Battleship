package javaimpl.players;

import javaimpl.strategies.DefensiveStrategy;
import javaimpl.strategies.OffensiveStrategy;

public class BattleshipBot extends Player {

    public BattleshipBot(OffensiveStrategy offensiveStrategy, DefensiveStrategy defensiveStrategy) {
        super(offensiveStrategy, defensiveStrategy);
    }

    @Override
    public boolean isRobot() {
        return true;
    }
}
