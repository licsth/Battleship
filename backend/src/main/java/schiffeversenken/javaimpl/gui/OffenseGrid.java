package schiffeversenken.javaimpl.gui;

import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

public class OffenseGrid extends BattleshipGrid {

    private long currentChoice;
    private final OffensiveStrategy strat;
    public OffenseGrid(OffensiveStrategy strat) {
        super("Offensive Grid");
        this.strat = strat;
        this.currentChoice = 0L;
    }

    @Override
    protected void registerClick(int i, int j) {
        for (int k = 0; k < GRID_SIZE; k++) {
            for (int l = 0; l < GRID_SIZE; l++) {
                buttons[k][l].setText("");
            }
        }
        buttons[i][j].setText("*");
        this.currentChoice = 1L << (7-i)*8+7-j;
    }

    @Override
    protected void makeChoice() {
        strat.nextMove = currentChoice;
        System.out.println(currentChoice);
        currentChoice = 0L;
    }
}
