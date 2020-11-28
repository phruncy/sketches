 import interfascia.*;
 
 //GUI Elemnte
 GUIController c;
 IFTextField t;
 
 Automaton cellularAutomaton;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 10;
  int visualCellWidth = 10;
  
  void setup()
  {
    size(1280, 720);
    background (0);
    
    c= new GUIController(this);
    t = new IFTextField("Text Field", 25, 30, 150);
    
    c.add(t);
    t.addActionListener(this);
    
    cellularAutomaton = new Automaton (0, visualCellWidth, visualCellLength );
    cellularAutomaton.initialise();
    
    
  }
  void draw ()
  {
    cellularAutomaton.run();   ; 
      
  }
  
  //Eingabe der Regel in das GUI ändert die Regel im Automaten und startet ihn neu
  void actionPerformed(GUIEvent e) 
  {
    if (e.getMessage().equals("Completed")) 
    {
      cellularAutomaton.caRuleNumber = int(t.getValue());
      cellularAutomaton.clearAll();
    }
  }
  
  void mousePressed()
  {
    cellularAutomaton.clearAll();
    
  }
  
 
