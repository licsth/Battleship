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
import schiffeversenken.javaimpl.strategies.DefensiveStrategy;
import schiffeversenken.javaimpl.strategies.OffensiveStrategy;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HTMLInterface {

    private DefensiveStrategy defensiveStrategy = null;
    private OffensiveStrategy offensiveStrategy = null;

    @PostMapping("/api/start")
    public void start(@RequestBody StrategiesDto strategies) {
      System.out.println("Received start request with strategies: " + strategies.defensiveStrategy + " " + strategies.offensiveStrategy);
      if(strategies.defensiveStrategy.equals("HideShips")) {
        // TODO pass states
        defensiveStrategy = new HideShips(new long[0]);
      } else if(strategies.defensiveStrategy.equals("RandomPlacement")) {
        try{defensiveStrategy = new RandomPlacement();} catch(Exception e){throw new RuntimeException(e);}
      } else {
        throw new IllegalArgumentException("Unknown defensive strategy: " + strategies.defensiveStrategy);
      }

      if(strategies.offensiveStrategy.equals("RandomGuesses")) {
        offensiveStrategy = new RandomGuesses();
      } else if(strategies.offensiveStrategy.equals("GridGuesses")) {
        offensiveStrategy = new GridGuesses(true);
      } else {
        throw new IllegalArgumentException("Unknown offensive strategy: " + strategies.offensiveStrategy);
      }
      
    }

    @PostMapping("/api/guess")
    public int guess(@RequestBody String guess) {
      System.out.println("Received guess: " + guess);
      if (defensiveStrategy == null) {
        throw new IllegalStateException("Defensive strategy not set up");
      }
      long square = 1L << (63-Integer.parseInt(guess));
      return defensiveStrategy.shootSquare(square);
    }

    @PostMapping("/api/respondToGuess")
    public void guess(@RequestBody GuessResponse guessResponse) {
      System.out.println("Guess " + guessResponse.guess + " returned state " + guessResponse.state);
      if (offensiveStrategy == null) {
        throw new IllegalStateException("Offensive strategy not set up");
      }
      // TODO check if it's enough to pass in the state, not the guess
      offensiveStrategy.update(guessResponse.state);
    }

    @GetMapping("/api/nextMove")
    public int getNextMove() {
      System.out.println("Received request for next move");
      if (offensiveStrategy == null) {
        throw new IllegalStateException("Offensive strategy not set up");
      }
      // TODO this isn't working. No idea how this is meant to be used.
      long nextMoveSquare = offensiveStrategy.nextMove;
      // return index of the first 1 in the bit representation of nextMoveSquare
      return Long.numberOfLeadingZeros(nextMoveSquare);
    }
}