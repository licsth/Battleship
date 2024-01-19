package java;

import java.io.*;

public class Gamestates {
    
    public long[] twoByOnePositions;
    public long[] threeByOnePositions;
    public long[] fourByOnePositions;
    public long[] twoByOneBoundaries;
    public long[] threeByOneBoundaries;
    public long[] fourByOneBoundaries;

    public Gamestates(int size) {
        twoByOnePositions = Game.getPositionsForOneByN(2, size);
        threeByOnePositions = Game.getPositionsForOneByN(3, size);
        fourByOnePositions = Game.getPositionsForOneByN(4, size);
        twoByOneBoundaries = Game.getBoundaries(twoByOnePositions, size);
        threeByOneBoundaries = Game.getBoundaries(threeByOnePositions, size);
        fourByOneBoundaries = Game.getBoundaries(fourByOnePositions, size);
    }

    public long tryAllStates(String filename) throws IOException{
        long accepted = 0;
        long blockedSquares1, blockedSquares2, blockedSquares3, blockedSquares4, blockedSquares5, blockedSquares6;
        try(DataOutputStream dos = new DataOutputStream(new FileOutputStream(filename))) {
            for(int i2=0; i2 < twoByOnePositions.length; i2++) {
                blockedSquares1 = twoByOnePositions[i2] | twoByOneBoundaries[i2];
                for(int j2=i2+1; j2 < twoByOnePositions.length; j2++) {
                    if((blockedSquares1 & twoByOnePositions[j2]) != 0) continue;
                    blockedSquares2 = blockedSquares1 | twoByOnePositions[j2] | twoByOneBoundaries[j2];
                    
                    for(int k2=j2+1; k2 < twoByOnePositions.length; k2++) {
                        if((blockedSquares2 & twoByOnePositions[k2]) != 0) continue;
                        blockedSquares3 = blockedSquares2 | twoByOnePositions[k2] | twoByOneBoundaries[k2];
                        
                        for(int i3=0; i3 < threeByOnePositions.length; i3++) {
                            if((blockedSquares3 & threeByOnePositions[i3]) != 0) continue;
                            blockedSquares4 = blockedSquares3 | threeByOnePositions[i3] | threeByOneBoundaries[i3];
                            
                            for(int j3=i3+1; j3 < threeByOnePositions.length; j3++) {
                                if((blockedSquares4 & threeByOnePositions[j3]) != 0) continue;
                                blockedSquares5 = blockedSquares4 | threeByOnePositions[j3] | threeByOneBoundaries[j3];
                            
                                for(int k3=j3+1; k3 < threeByOnePositions.length; k3++) {
                                    if((blockedSquares5 & threeByOnePositions[k3]) != 0) continue;
                                    blockedSquares6 = blockedSquares5 | threeByOnePositions[k3] | threeByOneBoundaries[k3];
                            
                                    for(int i4=0; i4 < fourByOnePositions.length; i4++) {
                                        if((blockedSquares6 & fourByOnePositions[i4]) == 0) {
                                            // long ships = twoByOnePositions[i2] |
                                            // twoByOnePositions[j2] |
                                            // twoByOnePositions[k2] |
                                            // threeByOnePositions[i3] |
                                            // threeByOnePositions[j3] |
                                            // threeByOnePositions[k3] |
                                            // fourByOnePositions[i4];
                                            // dos.writeLong(ships);
                                            accepted++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return accepted;
    }
}