package schiffeversenken.javaimpl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/myEndpoint")
    public long[] myEndpoint() {
        // Your Java code logic here
        // return "Test4";
        return Utils.getPositionsForOneByN(4, 8);
    }
}