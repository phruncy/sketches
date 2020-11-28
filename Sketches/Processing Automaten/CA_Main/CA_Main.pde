
  Automaton cellularAutomaton;
  //Settings
  //hier Automatenregel eingeben (vorläufig!)
  int ruleNumber = 97;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 2;
  int visualCellWidth = 2;
  
  void setup()
  {
    size(1280, 720);
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
  
 
