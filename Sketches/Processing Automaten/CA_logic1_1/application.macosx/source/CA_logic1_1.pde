import java.util.Observer;
import java.util.Observable;
import controlP5.*;

Automaton automaton;
DefaultViewModel viewModel;
DefaultView view;
Gui gui;


/// vorläufig!
public int ruleNr = 110;


void setup ()
{  
  
  size(1000,700);
  
  
  // Setup der MVVM-Komponenten
  automaton = new Automaton();
  viewModel = new DefaultViewModel(automaton);
  view = new DefaultView(viewModel);
  gui = new Gui(automaton, viewModel,view, this);
  
  //Setup Observer
  automaton.addObserver(viewModel);
  viewModel.addObserver(view);
  viewModel.addObserver(gui);
  
  //Initalisierung des Automaten
  automaton.initialise(viewModel.convertDecimalRule (ruleNr), viewModel.calculateCellNumber());
  println ("setup done");
  
  //Initialisierung der Grafischen Ausgabe
  view.initialise();
}

void draw()
{
    if (viewModel._runnable)
    {
      if(view.getIsRendered())
      {
       automaton.generateGeneration();
      }  
    }
  
}
