import ddf.minim.*;
Minim minim;
AudioPlayer player, player2;//erstellt einen Player für ein einziges Lied. Neues Lied, neuer Player (player2)
 
  Automaton cellularAutomaton;
  //Settings
  //hier Automatenregel eingeben (vorläufig!)
  int ruleNumber = 110;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 4;
  int visualCellWidth = 4;
  
  void setup()
  {
    size(1280, 720);
    background (0);
    cellularAutomaton = new Automaton (ruleNumber, visualCellWidth, visualCellLength );
    cellularAutomaton.initialise();
    
    minim = new Minim(this);
    player = minim.loadFile("Jazz.mp3");//importiert mp3 und weist es dem player zu
    player2 = minim.loadFile("ohyeah.mp3");
    player.play(); //befehl zum abspielen
    player.loop();//Wiederholt das lied immer wieder
  }
  void draw ()
  {
    cellularAutomaton.run();   
  }
  
  void mousePressed()
  {
    cellularAutomaton.clearAll();
    player2.rewind();
    player2.play();
  }
  
 
