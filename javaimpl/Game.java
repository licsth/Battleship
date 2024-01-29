package javaImpl;

import java.util.Arrays;

/**
 * A collection of helpful methods for battleship
 */
public class Game {

    /**
     * This method returns for a given ship all positions
     * that the ship can be in on the given board size
     * @param ship the ship, vertically at the bottom left
     * @param freeSquaresAbove how many squares are free above the ship
     * @param size the size of the board
     * @return an array of all vertical positions this ship can be in
     */
    private static long[] getVerticalPositions(long ship, int freeSquaresAbove, int size) {
        int numberOfPositions = size * (freeSquaresAbove + 1);
        long[] positions = new long[numberOfPositions];
        positions[0] = ship;
        for(int i = 1; i < numberOfPositions; i++) {
            positions[i] = positions[i-1] << 1;
        }
        return positions;
    }

    /**
     * This method transposes all vertical positions to get
     * the horizontal positions a ship can be in
     * @param verticalPositions an array of all vertical positions
     * @param size the size of the board
     * @return all horizontal positions the ship can be in
     */
    private static long[] getHorizontalPositions(long[] verticalPositions, int size) {
        long[] positions = new long[verticalPositions.length];
        for(int i = 0; i < verticalPositions.length; i++) {
            positions[i] = Game.transpose_board(verticalPositions[i], size);
        }
        return positions;
    }

    /**
     * This method returns all positions a given ship can be in for a specified board
     * @param ship the ship at the bottom left, vertical
     * @param size the size of the board
     * @return all positions the ship can be in
     */
    public static long[] getPositions(long ship, int size) {
        int freeSequaresAbove = size;
        while((ship & (1L << (size * (size - freeSequaresAbove)))) != 0L)
            freeSequaresAbove--;
        long[] verticalPositions = getVerticalPositions(ship, freeSequaresAbove, size);
        
        if(ship == 1L) return verticalPositions;
        
        long[] horizontalPositions = getHorizontalPositions(verticalPositions, size);
        long[] result = Arrays.copyOf(verticalPositions, verticalPositions.length + horizontalPositions.length);
        System.arraycopy(horizontalPositions, 0, result, verticalPositions.length, horizontalPositions.length);
        return result;
    }

    /**
     * This method returns all positions a 1xn ship can be in on a given board
     * @param n the length of the ship
     * @param size the size of the board
     * @return all positions for a 1xn ship
     */
    public static long[] getPositionsForOneByN(int n, int size) {
        return getPositions(Game.oneByNShip(n, size), size);
    }

    /**
     * This method returns the boundary of a given ship.
     * (Works with multiple ships simultaneously)
     * @param ship the ship(s)
     * @param size the board size
     * @return the boundary of the ship
     */
    public static long getBoundary(long ship, int size) {
        long boundary = 0L;
        for (int i = 0; i < size*size; i++) {
            if ((ship & (1L << i)) != 0) {
                int row = i / size;
                int col = i % size;
                for (int r = Math.max(0, row - 1); r <= Math.min(size-1, row + 1); r++) {
                    for (int c = Math.max(0, col - 1); c <= Math.min(size-1, col + 1); c++) {
                        boundary |= (1L << (r * size + c));
                    }
                }
            }
        }
        return (boundary & (~ship));
    }

    /**
     * This method returns the boundaries of an array of ships
     * @param ships the ships
     * @param size the board size
     * @return an array of the boundaries
     */
    public static long[] getBoundaries(long[] ships, int size) {
        long[] boundaries = new long[ships.length];
        for(int i = 0; i < ships.length; i++) {
            boundaries[i] = Game.getBoundary(ships[i], size);
        }
        return boundaries;
    }

    /**
     * This method transposes a game state, meaning the result is a long
     * representing the game state where the entry corresponding to (i,j)
     * is 1 iff (j,i) is 1 in the parameter
     * @param state the state to transpose
     * @param size the board size
     * @return the transposed state
     */
    public static Long transpose_board(long state, int size) {
        long transposed = 0;
        for(int i = 0; i < size; i++) {
            for(int j = 0; j < size; j++) {
                if(i <= j) // upper right
                    transposed |= ((state & (1L << (size*size - 1 - (i * size + j)))) >> ((size-1)*(j-i)));
                else
                    transposed |= ((state & (1L << (size*size - 1 - (i * size + j)))) << ((size-1)*(i-j)));
            }
        }
        return transposed;
    }

    /**
     * Returns whether ship is a valid placement for the specified state
     * @param missedShots the missed shots
     * @param hitShips the hit ships
     * @param sunkShips the sunk ships
     * @param ship the ship to place
     * @param boundary the boundary of the ship to place
     * @return whether the ship can be placed
     */
    public static boolean isShipPositionValid(long missedShots, long hitShips, long sunkShips, long ship,
            long boundary) {
        return (((missedShots | sunkShips) & ship) | (hitShips & boundary)) == 0L;
    }

    /**
     * Prints a representation of the game state to the console
     * @param missedShots the missed shots
     * @param hitShips the hit ships
     * @param sunkShips the sunk ships
     * @param size the board size
     */
    public static void printBoardState(long missedShots, long hitShips, long sunkShips, int size) {
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                long mask = 1L << (size*size - 1 - (i * size + j));
                if ((missedShots & mask) != 0) {
                    System.out.print("x ");
                } else if ((hitShips & mask) != 0) {
                    System.out.print("+ ");
                } else if ((sunkShips & mask) != 0) {
                    System.out.print("# ");
                } else {
                    System.out.print("o ");
                }
            }
            System.out.println();
        }
    }

    /**
     * Returns the long represention of a 1xn ship on a game board of specified size
     * @param n the length of the ship
     * @param size the board size
     * @return the 1xn ship
     */
    public static long oneByNShip(int n, int size) {
        long ship = 0L;
        for(int i = 0; i < n; i++) {
            ship |= (1L << (i * size));
        }
        return ship;
    }

}
