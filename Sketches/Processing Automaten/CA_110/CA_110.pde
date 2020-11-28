import processing.pdf.*;


  Automaton cellularAutomaton;
  //Settings
  //hier Automatenregel eingeben (vorläufig!)
  int ruleNumber = 110;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 1;
  int visualCellWidth = 1;
  
  void setup()
  {
    size(500, 2000, PDF, "render##.pdf");
    background (0);
    cellularAutomaton = new Automaton (ruleNumber, visualCellWidth, visualCellLength );
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
  
 
