package javaimpl;

import java.util.Random;

/**
 * This offensive strategy guesses a random free square to shoot at.
 */
public class RandomGuesses extends OffensiveStrategy {

    private final Random random;

    private final int numberOfSquares;
    public RandomGuesses(int boardSize) {
        super(boardSize);
        this.numberOfSquares = boardSize*boardSize;
        this.random = new Random();
    }

    @Override
    public long getNextMove(long miss, long hit, long sunk) {
        long guess = 1L << random.nextInt(numberOfSquares);
        while((guess & (miss | hit | sunk)) != 0) {
            guess = 1L << random.nextInt(numberOfSquares);
        }
        return guess;
    }
}
