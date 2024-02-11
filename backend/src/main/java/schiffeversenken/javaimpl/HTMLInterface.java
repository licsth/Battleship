package schiffeversenken.javaimpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.FileInputStream;

import org.springframework.web.bind.annotation.CrossOrigin;

import schiffeversenken.javaimpl.strategies.*;
import schiffeversenken.javaimpl.players.Player;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HTMLInterface {

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
        // TODO pass states
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
      long[] states = new long[Gamestates.STATES_IN_STANDARD_8x8];
      try (DataInputStream ds = new DataInputStream(
          new BufferedInputStream(new FileInputStream(Game.GAME_STATES_FILENAME)))) {
        for (int i = 0; i < states.length; i++) {
          states[i] = ds.readLong();
        }
      } catch (Exception e) {
        // print exception
        System.out.println(e);
        System.out.println("Error reading states");
      }
      return states;
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
}