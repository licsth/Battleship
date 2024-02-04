package schiffeversenken.javaimpl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @GetMapping("/api/hallo")
    public String hallo() {
        return "Hallo";
    }

    @GetMapping("/api/myEndpoint")
    public long[] myEndpoint() {
        return Utils.getPositionsForOneByN(4, 8);
    }
}