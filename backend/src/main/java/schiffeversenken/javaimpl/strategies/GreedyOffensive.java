package schiffeversenken.javaimpl.strategies;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import schiffeversenken.javaimpl.Utils;

/**
 * This offensive strategy guesses a random free square to shoot at.
 */
public class GreedyOffensive extends OffensiveStrategy {

    long[] remainingValidStates;
    int[] remainingConfigs;
    int remainingValidStatesCutoff;

    public GreedyOffensive(long[] states, int[][] totalConfigs) {
        this.remainingValidStates = states;
        remainingValidStatesCutoff = remainingValidStates.length;
        this.remainingConfigs = new int[64];
        for(int i = 0; i < 64; i++) {
            remainingConfigs[i] = totalConfigs[i / 8][i % 8];
        }
        int maxIndex = 0;
        for(int i = 0; i < 64; i++) {
            if(remainingConfigs[i] > remainingConfigs[maxIndex]) {
                maxIndex = i;
            }
        }
        this.nextMove = 1L << maxIndex;
    }

    @Override
    public void update(int state) {
      if (state == 0) {
          miss |= nextMove;
      } else if (state == 1) {
          hit |= nextMove;
      } else {
          long ship = Utils.getSunkShip(hit, nextMove, 8);
          miss |= Utils.getBoundary(ship, 8);
          hit &= ~ship;
          sunk |= ship;
      }

      int index = 0;

      for(int k = 0; k < remainingValidStatesCutoff; k++) {
        long l = remainingValidStates[k];
        // TODO hit ships must have a missing square
        if((l & miss) != 0 || (hit & ~l) != 0 || (sunk & ~l) != 0) {
          for(int i = 0; i < 64; i++) {
            if((l & (1L << i)) != 0) {
              remainingConfigs[i]--;
            }
          }
        }
        else {
          remainingValidStates[index++] = l;
        }
      }
      remainingValidStatesCutoff = index;
      System.out.println("number of remaining states: " + remainingValidStatesCutoff);

      int maxIndex = -1;
      for(int i = 0; i < 64; i++) {
        if((maxIndex < 0 || remainingConfigs[i] > remainingConfigs[maxIndex]) && ((hit | sunk) & (1L << i)) == 0) {
          maxIndex = i;
        }
      }

      System.out.println("Max index: " + maxIndex);
      nextMove = 1L << maxIndex;
    }

    @Override
    public void computeNextMove() {
        // long guess = guesses.remove(0);
        // while ((guess & (miss | hit | sunk)) != 0) {
        //     guess = guesses.remove(0);
        // }
        // this.nextMove = guess;
    }
}
