/*
Vorgänger: CA_Colours
Änderungen: _Reset des Automaten bei Drücken der Tab-Taste. Vorher: bei Mausklick
_Random  initaliser hinzugefügt
*/
import ddf.minim.*;
import interfascia.*;
 
 //GUI Elemnte
 GUIController c;
 IFTextField t;
 Minim minim;
 AudioPlayer ohyeah;
 
 Automaton cellularAutomaton;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 3;
  int visualCellWidth = width;
  
  void setup()
  {
    size(200, 1000);
    background (255);
    
    c= new GUIController(this);
    t = new IFTextField("Text Field", 25, 30, 150);
    
    c.add(t);
    t.addActionListener(this);
    minim = new Minim(this);
    ohyeah = minim.loadFile("ohyeah.mp3");
    
    cellularAutomaton = new Automaton (110, width, visualCellLength );
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
      if(cellularAutomaton.caRuleNumber == 69)
      {
        ohyeah.play();
      }
    }
  }
  
  void keyPressed()
  {
    if (key == TAB)
    {
      cellularAutomaton.clearAll();
    }
  }
  
