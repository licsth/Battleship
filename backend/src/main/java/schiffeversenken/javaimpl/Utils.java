package schiffeversenken.javaimpl;

import java.util.Arrays;
import java.util.Random;

public class Utils {

    private static long[] getVerticalPositions(long ship, int freeSquaresAbove, int size) {
        int numberOfPositions = size * (freeSquaresAbove + 1);
        long[] positions = new long[numberOfPositions];
        positions[0] = ship;
        for(int i = 1; i < numberOfPositions; i++) {
            positions[i] = positions[i-1] << 1;
        }
        return positions;
    }

    private static long[] getHorizontalPositions(long[] verticalPositions, int size) {
        long[] positions = new long[verticalPositions.length];
        for(int i = 0; i < verticalPositions.length; i++) {
            positions[i] = Utils.transpose_board(verticalPositions[i], size);
        }
        return positions;
    }

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

    public static long[] getPositionsForOneByN(int n, int size) {
        return getPositions(Utils.oneByNShip(n, size), size);
    }

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

    public static long[] getBoundaries(long[] ships, int size) {
        long[] boundaries = new long[ships.length];
        for(int i = 0; i < ships.length; i++) {
            boundaries[i] = Utils.getBoundary(ships[i], size);
        }
        return boundaries;
    }

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

    public static boolean isShipPositionValid(long missedShots, long hitShips, long sunkShips, long ship,
            long boundary) {
        return (((missedShots | sunkShips) & ship) | (hitShips & boundary)) == 0L;
    }

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

    public static long oneByNShip(int n, int size) {
        long ship = 0L;
        for(int i = 0; i < n; i++) {
            ship |= (1L << (i * size));
        }
        return ship;
    }

    public static void shuffleArray(long[] arr, Random rnd) {
        for (int i = arr.length - 1; i > 0; i--) {
            int index = rnd.nextInt(i + 1);
            long tmp = arr[index];
            arr[index] = arr[i];
            arr[i] = tmp;
        }
    }

    /**
     * This method returns for a given square and hits the connected component of
     * hits that the square belongs to (when added to the hits)
     *
     * @param hits   the known hits
     * @param square the square
     * @return the ship that the square belongs to
     */
    public static long getSunkShip(long hits, long square, int boardSize) {
        long ship = square;
        hits |= square;
        while ((ship & hits) != 0) {
            hits &= ~ship;
            long shipUp = ship << boardSize & hits;
            long shipDown = ship >>> boardSize & hits;
            // leftMask is a mask that is 1 on all positions that are not on the left edge of the board
            long leftMask = 0xfefefefefefefefeL >>> (64 - boardSize);
            long shipLeft = (ship & ~leftMask) << 1 & hits;
            // rightMask is a mask that is 1 on all positions that are not on the right edge of the board
            long rightMask = 0x7f7f7f7f7f7f7f7fL >>> (64 - boardSize);
            long shipRight = (ship & ~rightMask) >>> 1 & hits;
            ship |= shipUp | shipDown | shipLeft | shipRight;
        }
        return ship;
    }

}
