package schiffeversenken.javaimpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.RandomAccessFile;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

import schiffeversenken.javaimpl.strategies.*;
import schiffeversenken.javaimpl.players.Player;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HTMLInterface {

  long[] states;

  public HTMLInterface() {
    this.states = Utils.readStatesFromFile();
  }

  private Player computerPlayer = null;

  @PostMapping("/api/start")
  public void start(@RequestBody StrategiesDto strategies) {
    System.out.println(
        "Received start request with strategies: " + strategies.defensiveStrategy + " " + strategies.offensiveStrategy);

    long[] states = readStatesIfNecessary(strategies.offensiveStrategy, strategies.defensiveStrategy);
    System.out.println("Read states: " + states.length);
    DefensiveStrategy defensiveStrategy;
    switch (strategies.defensiveStrategy) {
      case "HideShips":
        defensiveStrategy = new HideShips(states);
        break;

      case "RandomPlacement":
        try {
          defensiveStrategy = new RandomPlacement();
        } catch (Exception e) {
          throw new RuntimeException(e);
        }
        break;

      default:
        throw new IllegalArgumentException("Unknown defensive strategy: " + strategies.defensiveStrategy);
    }

    OffensiveStrategy offensiveStrategy;
    switch (strategies.offensiveStrategy) {
      case "RandomGuesses":
        offensiveStrategy = new RandomGuesses();
        break;
      case "GridGuesses":
        offensiveStrategy = new GridGuesses(true);
        break;
      default:
        throw new IllegalArgumentException("Unknown offensive strategy: " + strategies.offensiveStrategy);
    }

    this.computerPlayer = new Player(offensiveStrategy, defensiveStrategy);

  }

  /**
   * This method determines whether the states have to be read in. If so, it does,
   * otherwise it returns an empty array.
   * 
   * @param defensiveStrategy
   * @param offensiveStrategy
   * 
   * @return The states or an empty array if no strategy requires the states to be
   *         known.
   */
  private long[] readStatesIfNecessary(String offensiveStrategy, String defensiveStrategy) {
    if (defensiveStrategy.equals("HideShips")) {
      return Utils.readStatesFromFile();
    }
    return new long[0];
  }

  @PostMapping("/api/guess")
  public int guess(@RequestBody String guess) {
    System.out.println("Received guess: " + guess);
    if (computerPlayer == null) {
      throw new IllegalStateException("Defensive strategy not set up");
    }
    long square = 1L << (63 - Integer.parseInt(guess));
    return computerPlayer.shootSquare(square);
  }

  @PostMapping("/api/respondToGuess")
  public void guess(@RequestBody GuessResponse guessResponse) {
    System.out.println("Guess " + guessResponse.guess + " returned state " + guessResponse.state);
    if (computerPlayer == null) {
      throw new IllegalStateException("Offensive strategy not set up");
    }
    computerPlayer.notify(guessResponse.state);
  }

  @GetMapping("/api/nextMove")
  public int getNextMove() {
    System.out.println("Received request for next move");
    if (computerPlayer == null) {
      throw new IllegalStateException("Offensive strategy not set up");
    }
    // return index of the first 1 in the bit representation of nextMoveSquare
    return Long.numberOfLeadingZeros(computerPlayer.getNextMove());
  }

  @PostMapping("/api/possibleConfigs")
  public int[][] getNextMove(@RequestBody CurrentState currentState) {
    long miss = Utils.arrayToLong(currentState.misses);
    long hit = Utils.arrayToLong(currentState.hits);
    long sunk = Utils.arrayToLong(currentState.sunk);
    long boundary = Utils.getBoundary(sunk, 8);
    int[] configs = new int[64];
    for(long l : states) {
      if((l & (miss | boundary)) != 0) {
        continue;
      }
      // TODO hit ships must have a missing square
        continue;
      }
      if((sunk & ~l) != 0) {
        continue;
      }
      for(int i = 0; i < 64; i++) {
        if((l & (1L << i)) != 0) {
          configs[i]++;
        }
      }
    }
    int[][] result = new int[8][8];
    for(int i = 0; i < 64; i++) {
      result[i / 8][i % 8] = configs[i];
    }
    return result;
  }

  @GetMapping("/api/randomConfig")
  public int[][] getRandomState() {
    try {
      Random rnd = ThreadLocalRandom.current();
      long pos = rnd.nextLong(Gamestates.STATES_IN_STANDARD_8x8);
      RandomAccessFile raf = new RandomAccessFile(Game.GAME_STATES_FILENAME, "r");
      raf.seek(pos * Long.BYTES);
      long state = raf.readLong();
      raf.close();
      return Utils.longTo2DArray(state);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}