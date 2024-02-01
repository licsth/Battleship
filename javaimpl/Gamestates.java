package javaimpl;

import java.util.Arrays;
import java.util.Objects;

public class Gamestates {



    public long[] twoByOnePositions;
    public long[] threeByOnePositions;
    public long[] fourByOnePositions;
    public long[] twoByOneBoundaries;
    public long[] threeByOneBoundaries;
    public long[] fourByOneBoundaries;

    public long[] gameStates;

    public Gamestates(boolean precompute) {
        twoByOnePositions = Utils.getPositionsForOneByN(2, 8);
        threeByOnePositions = Utils.getPositionsForOneByN(3, 8);
        fourByOnePositions = Utils.getPositionsForOneByN(4, 8);
        twoByOneBoundaries = Utils.getBoundaries(twoByOnePositions, 8);
        threeByOneBoundaries = Utils.getBoundaries(threeByOnePositions, 8);
        fourByOneBoundaries = Utils.getBoundaries(fourByOnePositions, 8);

        if (precompute) {
            System.out.println("Starting precomputation... ");
            gameStates = getAllStates();
            System.out.println("Done");
        }
    }

    public static final int STATES_IN_STANDARD_8x8 = 382820608;

    public long[] getAllStates() {
        long[] accepted = new long[STATES_IN_STANDARD_8x8];
        int numberAccepted = 0;
        long blockedSquares1, blockedSquares2, blockedSquares3, blockedSquares4, blockedSquares5, blockedSquares6;

        for (int i2 = 0; i2 < twoByOnePositions.length; i2++) {
            System.out.println(i2 + 1 + "/" + twoByOnePositions.length);
            blockedSquares1 = twoByOnePositions[i2] | twoByOneBoundaries[i2];
            for (int j2 = i2 + 1; j2 < twoByOnePositions.length; j2++) {
                if ((blockedSquares1 & twoByOnePositions[j2]) != 0)
                    continue;
                blockedSquares2 = blockedSquares1 | twoByOnePositions[j2] | twoByOneBoundaries[j2];

                for (int k2 = j2 + 1; k2 < twoByOnePositions.length; k2++) {
                    if ((blockedSquares2 & twoByOnePositions[k2]) != 0)
                        continue;
                    blockedSquares3 = blockedSquares2 | twoByOnePositions[k2] | twoByOneBoundaries[k2];

                    for (int i3 = 0; i3 < threeByOnePositions.length; i3++) {
                        if ((blockedSquares3 & threeByOnePositions[i3]) != 0)
                            continue;
                        blockedSquares4 = blockedSquares3 | threeByOnePositions[i3] | threeByOneBoundaries[i3];

                        for (int j3 = i3 + 1; j3 < threeByOnePositions.length; j3++) {
                            if ((blockedSquares4 & threeByOnePositions[j3]) != 0)
                                continue;
                            blockedSquares5 = blockedSquares4 | threeByOnePositions[j3] | threeByOneBoundaries[j3];

                            for (int k3 = j3 + 1; k3 < threeByOnePositions.length; k3++) {
                                if ((blockedSquares5 & threeByOnePositions[k3]) != 0)
                                    continue;
                                blockedSquares6 = blockedSquares5 | threeByOnePositions[k3]
                                        | threeByOneBoundaries[k3];

                                for (long fourByOnePosition : fourByOnePositions) {
                                    if ((blockedSquares6 & fourByOnePosition) == 0) {
                                        accepted[numberAccepted++] = twoByOnePositions[i2] |
                                                twoByOnePositions[j2] |
                                                twoByOnePositions[k2] |
                                                threeByOnePositions[i3] |
                                                threeByOnePositions[j3] |
                                                threeByOnePositions[k3] |
                                                fourByOnePosition;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return accepted;
    }

    /*
     * missedShots should not intersect the state
     * all hitShips and sunkShips must be covered
     * we need to add the boundary of sunkShips to missedShots:
     * consider top left corner sunk and hit but not sunk two squares below, no
     * missed shots;
     * by current requirements, a 4x1 may be placed vertically in the top left
     * corner!
     * This method assumes that is done! (Call missedShots |=
     * Utils.getBoundary(sunkShips, 8);)
     */
    public long[] getValidStates(long missedShots, long hitShips, long sunkShips) {
        Objects.requireNonNull(gameStates, "The game states were not precomputed.");
        return Arrays.stream(gameStates)
                .filter(state -> ((missedShots & state) == 0) && (((hitShips | sunkShips) & (~sunkShips)) == 0))
                .toArray();
    }

}
