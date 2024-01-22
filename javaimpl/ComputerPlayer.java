package javaimpl;

/**
 * A computer player will play battleship against you, by providing a method for
 */
public class ComputerPlayer {

    public long[][] positions; // positions[i] is the array of all positions of ix1 ship
    public long[][] boundaries; // boundaries[i][j] is the boundary for positions[i][j]
    public int[] numberOfShipsPerType;
    public int boardSize;

    public ComputerPlayer(int boardSize, int[] numberOfShipsPerType) {
        this.boardSize = boardSize;
        this.numberOfShipsPerType = numberOfShipsPerType;

        this.positions = new long[4][];
        this.boundaries = new long[4][];

        int longestShip = 4;
        while (numberOfShipsPerType[longestShip - 1] == 0)
            longestShip--;

        for (int i = 0; i < longestShip; i++) {
            this.positions[i] = Game.getPositionsForOneByN(i + 1, boardSize);
            this.boundaries[i] = Game.getBoundaries(this.positions[i], boardSize);
        }
    }

    /**
     * This method returns for a specified game board a two-dimensional array
     * where each entry specifies in how many of the possible game states
     * there is a ship on the corresponding square.
     * 
     * @param hitShips       a long representation of hits (without sinking)
     * @param sunkShips      a long representation of sunk ships
     * @param missedShots    long representation of missed shots
     * @param remainingShips an int array of length 4 specifying how
     *                       many ships of each length remain to be placed
     * @return in how many states each square is occupied
     */
    public int[][] getNumberOfCombinationsPerSquare(long hitShips, long sunkShips, long missedShots,
            int[] remainingShips) {
        int[][] combinations = new int[boardSize][boardSize];

        // anchor
        if (remainingShips[0] + remainingShips[1] + remainingShips[2] + remainingShips[3] == 0) {
            if (hitShips == 0L) { // valid state
                combinations = addCombination(combinations, sunkShips, boardSize);
            }
            return combinations;
        }

        // determine shipIndex
        int shipIndex = 0;
        while (remainingShips[shipIndex] == 0)
            shipIndex++;
        remainingShips[shipIndex]--; // I think this does not behave well with recursion.

        // recursion
        for (int i = 0; i < this.positions[shipIndex].length; i++) {
            long ship = this.positions[shipIndex][i];
            long boundary = this.boundaries[shipIndex][i];
            if (Game.isShipPositionValid(missedShots, hitShips, sunkShips, ship, boundary)) {
                combinations = addArrays(combinations, getNumberOfCombinationsPerSquare(hitShips & (~ship),
                        sunkShips | ship, missedShots | boundary, remainingShips));
            }
        }
        remainingShips[shipIndex]++; // I think this puts it back the way it is supposed to be
        return combinations;
    }

    /**
     * This method returns for a specified gameboard how many arrangements there are left
     * @param hitShips a long representation of hits (without sinking)
     * @param sunkShips a long representation of sunk ships
     * @param missedShots  long representation of missed shots
     * @param remainingShips an int array of length 4 specifying how 
     * many ships of each length remain to be placed
     * @return in how many states each square is occupied
     */
    public int getNumberOfPossibleStates(long hitShips, long sunkShips, long missedShots, int[] remainingShips) {
        
        // anchor
        if(remainingShips[0] + remainingShips[1] + remainingShips[2] + remainingShips[3] == 0) {
            return hitShips == 0L ? 1 : 0;
        }
        
        int numberOfStates = 0;

        // determine shipIndex
        int shipIndex = 0;
        while(remainingShips[shipIndex] == 0) shipIndex++;
        remainingShips[shipIndex]--; // I think this does not behave well with recursion.
        
        // recursion
        for(int i = 0; i < this.positions[shipIndex].length; i++) {
            long ship = this.positions[shipIndex][i];
            long boundary = this.boundaries[shipIndex][i];
            if(Game.isShipPositionValid(missedShots, hitShips, sunkShips, ship, boundary)) {
                numberOfStates += getNumberOfPossibleStates(hitShips & (~ship), sunkShips | ship, missedShots | boundary, remainingShips);
            }
        }
        remainingShips[shipIndex]++; // I think this puts it back the way it is supposed to be
        return numberOfStates;
    }

    private static int[][] addCombination(int[][] combinations, long state, int size) {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                long mask = 1L << (size * size - 1 - (i * size + j));
                if ((state & mask) != 0) {
                    combinations[i][j] += 1;
                }
            }
        }
        return combinations;
    }

    private static int[][] addArrays(int[][] a, int[][] b) {
        int[][] res = new int[a.length][a[0].length];
        for (int i = 0; i < a.length; i++)
            for (int j = 0; j < a[0].length; j++)
                res[i][j] = a[i][j] + b[i][j];
        return res;
    }
}
