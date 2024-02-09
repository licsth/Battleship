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
        try (DataOutputStream ds = new DataOutputStream(
                new BufferedOutputStream(new FileOutputStream(Game.GAME_STATES_FILENAME)))) {
            for (long l : gs.gameStates) {
                ds.writeLong(l);
            }
        } catch (Exception e) {
        }

        // ------------ THIS CAN BE USED TO LOAD THE
        // long[] states = new long[Gamestates.STATES_IN_STANDARD_8x8];
        // long start = System.currentTimeMillis();
        // System.out.println("Started reading gamestates.bin...");
        // try (DataInputStream ds = new DataInputStream(
        //     new BufferedInputStream(new FileInputStream("gamestates.bin")))) {
        //     for (int i = 0; i < states.length; i++) {
        //         states[i] = ds.readLong();
        //     }
        // } catch (Exception e) {
        //     System.out.println("Error reading gamestates.bin");
        // }
        // System.out.println("Read in " + (System.currentTimeMillis() - start) + " ms.");
    }
}
