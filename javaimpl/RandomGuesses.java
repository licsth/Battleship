package javaimpl;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * This offensive strategy guesses a random free square to shoot at.
 */
public class RandomGuesses extends OffensiveStrategy {

    private final List<Integer> guesses;
    public RandomGuesses(int boardSize) {
        super(boardSize);
        guesses = IntStream.range(0, boardSize * boardSize)
                .boxed()
                .collect(Collectors.toList());
        Collections.shuffle(guesses);
    }

    @Override
    public long getNextMove() {
        long guess = guesses.remove(0);
        while((guess & (miss | hit | sunk)) != 0) {
            guess = guesses.remove(0);
        }
        return guess;
    }
}
