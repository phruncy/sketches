import processing.pdf.*;


  Automaton cellularAutomaton;
  //Settings
 
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 1;
  int visualCellWidth = 1;

  
  void setup()
  {
    size(560, 1000, PDF, "background_continous.pdf");
    background (0);
    cellularAutomaton = new Automaton (visualCellWidth);
    cellularAutomaton.initialise();    
    
  }
  
  void draw ()
  {
    cellularAutomaton.run();   
  }
  
  void mousePressed()
  {
    cellularAutomaton.clearAll();    
  }
  
 
