package schiffeversenken.javaimpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import schiffeversenken.javaimpl.strategies.GridGuesses;
import schiffeversenken.javaimpl.strategies.HideShips;
import schiffeversenken.javaimpl.strategies.RandomPlacement;
import schiffeversenken.javaimpl.strategies.RandomGuesses;
import schiffeversenken.javaimpl.players.Player;
import schiffeversenken.javaimpl.strategies.DefensiveStrategy;
import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HTMLInterface {

  private Player computerPlayer = null;

  @PostMapping("/api/start")
  public void start(@RequestBody StrategiesDto strategies) {
    System.out.println(
        "Received start request with strategies: " + strategies.defensiveStrategy + " " + strategies.offensiveStrategy);

    DefensiveStrategy defensiveStrategy;
    switch (strategies.defensiveStrategy) {
      case "HideShips":
        // TODO pass states
        defensiveStrategy = new HideShips(new long[0]);
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
    // TODO check if it's enough to pass in the state, not the guess
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