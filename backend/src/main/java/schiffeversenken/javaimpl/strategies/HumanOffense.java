package schiffeversenken.javaimpl.strategies;

import schiffeversenken.javaimpl.gui.OffenseGrid;

public class HumanOffense extends OffensiveStrategy {

    private final OffenseGrid grid;

    public HumanOffense() {
        this.grid = new OffenseGrid(this);
    }

    @Override
    public void computeNextMove() {
        // TODO wait for human to make move, return it
        throw new RuntimeException();
    }
}
