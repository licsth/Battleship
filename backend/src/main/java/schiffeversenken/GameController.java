package schiffeversenken;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    @PostMapping("/api/startGame")
    public String startGame(@RequestBody String guess) {
        return "Hallo";
    }
}
