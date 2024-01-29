package javaimpl;

public class Main {

    public static void main(String[] args) {
        OffensiveStrategy strat = new RandomGuesses(8);
        for(int i = 0; i < 64; i++)
            System.out.println(strat.getNextMove());
    }
}
