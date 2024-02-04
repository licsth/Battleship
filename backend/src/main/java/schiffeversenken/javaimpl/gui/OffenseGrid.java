package schiffeversenken.javaimpl.gui;

import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

public class OffenseGrid extends BattleshipGrid {

    private final OffensiveStrategy strat;
    public OffenseGrid(OffensiveStrategy strat) {
        super("Offensive Grid");
        this.strat = strat;
    }

    @Override
    protected void registerClick(int i, int j) {
        // TODO mark square as chosen
        // TODO unmark all other squares
    }

    @Override
    protected void makeChoice() {
        // TODO forward choice to strategy, wait for reply, deal with reply
    }


}
