package schiffeversenken.javaimpl.strategies;

import schiffeversenken.javaimpl.gui.OffenseGrid;

public class HumanOffense extends OffensiveStrategy{

    public HumanOffense() {
        OffenseGrid grid = new OffenseGrid(this);
    }
    @Override
    public long getNextMove() {
        // TODO wait for human to make move, return it
        throw new RuntimeException();
    }
}
