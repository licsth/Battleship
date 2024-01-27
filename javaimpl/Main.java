package javaimpl;

public class Main {

    public static void main(String[] args) {
        // long start = System.currentTimeMillis();
        // int boardSize = 8;
        // int[] ships = new int[]{0, 3, 0, 1};
        // ComputerPlayer player = new ComputerPlayer(boardSize, ships);

        // int[][] tmp = player.getNumberOfCombinationsPerSquare(0L, 0L, 0L, ships);

        // System.out.println(Arrays.deepToString(tmp));
        // System.out.println("Finished in " + (System.currentTimeMillis() - start) +
        // "ms.");

        Gamestates gs = new Gamestates(8, true);
        long missedShots = 0b00001111_11111111_11111011_11111010_11111010_10101010_10101010_10101010L;
        Game.printBoardState(missedShots, 0, 0, 8);
        long start = System.currentTimeMillis();
        long[] states = gs.getValidStates(missedShots, 0, 0);
        System.out.println(System.currentTimeMillis() - start);
        for (long s : states) {
            Game.printBoardState(0, 0, s, 8);
            System.out.println();
        }
    }
}
