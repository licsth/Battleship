package schiffeversenken.javaimpl.strategies;

import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * This offensive strategy guesses a random free square to shoot at.
 */
public class RandomGuesses extends OffensiveStrategy {

    private final List<Long> guesses;
    public RandomGuesses() {
        guesses = IntStream.range(0, 64)
                .boxed()
                .map(i -> 1L << i)
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