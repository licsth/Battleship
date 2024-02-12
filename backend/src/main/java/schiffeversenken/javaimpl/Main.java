package schiffeversenken.javaimpl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;

public class Main {

    public static void main(String[] args) {

        Gamestates gs = new Gamestates(true);
        System.out.println("Started writing gamestates.bin...");
        try (DataOutputStream ds = new DataOutputStream(
                new BufferedOutputStream(new FileOutputStream(Game.GAME_STATES_FILENAME)))) {
            for (long l : gs.gameStates) {
                ds.writeLong(l);
            }
        } catch (Exception e) {
        }
        System.out.println("Wrote gamestates.bin");

        // ------------ THIS CAN BE USED TO LOAD THE GAMESTATES FROM THE FILE ------------
        // long states[] = Utils.readStatesFromFile();
    }
}
