package schiffeversenken.javaimpl.strategies;

import java.util.Arrays;

import schiffeversenken.javaimpl.Utils;

/**
 * This Defensive strategy will only admit a hit if there is no other way.
 * When forced to admit a hit, it will only admit to a ship being sunk when
 * forced to.
 * In particular, it cheats by having no predetermined state.
 * Instead, it moves its ships out of the way of shots.
 */
public class HideShips extends DefensiveStrategy {

    private long[] states;
    private int guessCount = 0;
    private final int guaranteedMisses = 5;

    public HideShips(long[] states) {
        super();
        this.states = states;
    }

    @Override
    public int shootSquare(long square) {
        int numberStates = 0;
        guessCount++;
        if(guessCount <= guaranteedMisses) {
            this.miss |= square;
            return 0;
        }
        if(guessCount == guaranteedMisses+1) {
            // filter states for the first time
            for (int i = 0; i < states.length; i++) {
                if ((states[i] & this.miss) == 0L) {
                    states[numberStates++] = states[i];
                }
            }
            System.out.println("Remaining states: " + numberStates);
            this.states = Arrays.copyOf(states, numberStates);
            numberStates = 0;
        }
        for (int i = 0; i < states.length; i++) {
            if ((states[i] & square) == 0L) {
                states[numberStates++] = states[i];
            }
        }
        if (numberStates > 0) {
            this.states = Arrays.copyOf(states, numberStates);
            this.miss |= square;
            return 0;
        }

        for (int i = 0; i < states.length; i++) {
            long ship = Utils.getSunkShip(states[i], square, 8);
            if ((ship & ~(this.hits | square)) != 0) {
                states[numberStates++] = states[i];
            }
        }
        if (numberStates > 0) {
            states = Arrays.copyOf(states, numberStates);
            this.hits |= square;
            return 1;
        }

        long ship = Utils.getSunkShip(states[0], square, 8);
        this.hits &= ~ship;
        this.sunk |= ship;
        return 2;
    }

    @Override
    public boolean hasLost() {
        return states.length == 1 && (states[0] == this.sunk);
    }
}
