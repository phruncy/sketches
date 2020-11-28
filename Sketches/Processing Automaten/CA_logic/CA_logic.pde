import java.util.Observer;
import java.util.Observable;

Automaton automaton;
DefaultViewMode viewMode;
Gui gui;
DefaultView view;

void setup ()
{  
  view = new DefaultView();
  viewMode = new DefaultViewMode();
  gui = new Gui(); //<>//
  println (gui);
  automaton = new Automaton(110, viewMode.calculateCellNumber());
  automaton.initialise();
  println ("setup done");
}

void draw()
{
  automaton.run();
}
