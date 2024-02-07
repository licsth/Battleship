package schiffeversenken.javaimpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HTMLInterface {

    @PostMapping("/api/guess")
    public long guess(@RequestBody String guess) {
      System.out.println("Received guess: " + guess);
      long square = 1L << (63-Integer.parseInt(guess));
      // TODO: return 2 if sunk, 1 if the guess is a hit, 0 if it's a miss
      return square;
    }

    @GetMapping("/api/nextMove")
    public long getNextMove() {
      // wait 3 seconds
      try {
        Thread.sleep(3000);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      System.out.println("Received request for next move");
      // TODO: return next move
      return 1L;
    }
}