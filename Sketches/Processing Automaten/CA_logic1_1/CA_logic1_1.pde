import java.util.Observer;
import java.util.Observable;
import controlP5.*;

Automaton automaton;
DefaultViewModel viewModel;
DefaultView view;
Gui gui;
ControlP5 cp5;

/// vorläufig!
public int ruleNr = 110;


void setup ()
{  
  
  size(1000,700);
  
  
  // Setup der MVVM-Komponenten
  automaton = new Automaton();
  viewModel = new DefaultViewModel(automaton);
  view = new DefaultView(viewModel);
  cp5 = new ControlP5(this);
  gui = new Gui(automaton, viewModel,view, cp5);
  
  //Setup Observer
  automaton.addObserver(viewModel);
  viewModel.addObserver(view);
  viewModel.addObserver(gui);
  
  //Initalisierung des Automaten
  viewModel.updateCellNumber();
  println(automaton._cellCount);
  automaton.initialise(viewModel.convertDecimalRule (ruleNr));
  
  //Initialisierung der Grafischen Ausgabe
  view.initialise();
  println ("setup done");
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
