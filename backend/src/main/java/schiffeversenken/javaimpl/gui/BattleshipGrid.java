package schiffeversenken.javaimpl.gui;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;

public abstract class BattleshipGrid extends JFrame {

    public static final int GRID_SIZE = 8;

    protected final JButton[][] buttons;

    public BattleshipGrid(String title) {
        super(title);

        addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                int width = getWidth();
                setSize(width, width);
            }
        });

        JPanel panel = new JPanel();
        panel.setLayout(new GridLayout(GRID_SIZE, GRID_SIZE));

        buttons = new JButton[GRID_SIZE][GRID_SIZE];

        for (int i = 0; i < GRID_SIZE; i++) {
            for (int j = 0; j < GRID_SIZE; j++) {
                buttons[i][j] = new JButton();
                buttons[i][j].setOpaque(true);
                int finalI = i;
                int finalJ = j;
                buttons[i][j].addActionListener(e -> registerClick(finalI, finalJ));
                buttons[i][j].setPreferredSize(new Dimension(50, 50));
                panel.add(buttons[i][j]);
            }
        }
        // TODO make confirmation button, hook it up to things.
        JButton confirmButton = new JButton("Confirm");
        confirmButton.addActionListener(e -> makeChoice());
        panel.add(confirmButton);
        add(panel);
        pack();
        setVisible(true);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    /**
     * This method determines what happens when a button is clicked. <br>
     * For an offensive grid, this logs in the players choice. <br>
     * For a defensive grid, this only has an effect during setup.
     * @param i the column of the click (left to right)
     * @param j the row of the click (top to bottom)
     */
    protected abstract void registerClick(int i, int j);

    /**
     * This method notifies the strategy of the choice that was made using registerClick().
     */
    protected abstract void makeChoice();

    /**
     * This method updates a square to the specified state.
     * @param i the column of the button (left to right)
     * @param j the row of the button (top to bottom)
     * @param state the state to set the button to
     */
    private void updateSquare(int i, int j, int state) {
        Color col;
        if(state == 0) {
            col = Color.GRAY;
        } else if(state == 1) {
            col = Color.RED;
        } else {
            col = Color.BLACK;
        }
        buttons[i][j].setBackground(col);
        buttons[i][j].repaint();
    }

    /**
     * This method updates the specified squares to the given state. <br>
     * Note that this method changes all specified squares to the same state.
     * @param squares the squares to update
     * @param state the state to set the button to
     */
    public void setStates(long squares, int state) {
        for (int i = 0; i < 64; i++) {
            if((squares & (1L << i)) != 0) {
                updateSquare((63-i)/8, 7-i%8, state);
            }
        }
    }

    /**
     * Unlocks all buttons that can still be pressed for when it is this players turn
     */
    public void unlock() {
        for (int i = 0; i < GRID_SIZE; i++) {
            for (int j = 0; j < GRID_SIZE; j++) {
                if (buttons[i][j].getBackground() == Color.gray) {
                    buttons[i][j].setEnabled(true);
                }

            }
        }
    }

    /**
     * Locks all buttons for when it is not this players turn
     */
    public void lock() {
        for (int i = 0; i < GRID_SIZE; i++) {
            for (int j = 0; j < GRID_SIZE; j++) {
                buttons[i][j].setEnabled(false);
            }
        }
    }
}

