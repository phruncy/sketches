class Automaton
{
  private int caRuleNumber; 
  private int [] ruleset = new int[8];
  private int generationCount;
  //Visuals
  private int cellWidth;//wird von eingabe im Main-Programm geliefert
  private final int movementRange = 30;// Abstand zwischen 0- und 1- Position
  private final int edge = 20; //Abstand zum Rand
  private final int gap = 10; //Abstand zwischen den Bällen
  private final int basePosition = height/2 + movementRange/2; //Position des 0-zustands
  private final int peakPosition = basePosition - movementRange; //Position des 1-Zustands

  
  
  
  //Zell-Array
  private Cell [] cell; 
  
  //Konstruktor
  public Automaton (int rule, int cellwidth, int celllength)
  {
    this.caRuleNumber = rule;
    this.cellWidth = cellwidth;
    this.generationCount= 0;
  }
  
  
  void clearAll()//bereinigt das Feld
  {
    convertRule(caRuleNumber);
    for (int i=0; i<cell.length; i++) 
    {
      cell[i].state =0;
    }    
    background(155,200,35);
    initialiseCell();  
    generationCount = 0;    
  }  
  
  //initialisiert die Zellen
  //Array Länge: (Fenstergröße - rand an beiden Seiten) : (Zellgröße + Zellabstand)
  void initialise ()
  {
    convertRule(caRuleNumber);
    cell = new Cell [(width- 2*edge + gap)/(cellWidth + gap)];
    //füllt Array mit neuen Zellen
    for (int i= 0; i< cell.length; i++)
    {
      cell[i]= new Cell (0);
      cell[i].position = i;
      //die Nachbarn der jeweils vorher initialisierten Zelle werden bestimmt (nicht für Zellen an den Rändern)
      if (i>1 && i<cell.length) 
      {
        cell[i-1].setNeighbours();
      }  
    }
    clearAll();
  }
  
  //Vorläufig!!!!!!!! legt den Startwert fest
  void initialiseCell() 
  {
    cell [cell.length/2].state= 1;
  } 
  
  //konvertiert die Regelnummer in ein int-Array
  void convertRule (int rulenumber) 
  {
    int modulo = rulenumber;
    for (int n= 0; n<ruleset.length; n++)
    {
      ruleset [n] = modulo % 2;
      modulo = modulo/2;
    }
  }
    
  //berechnet die grafische Ausgabe aus dem Zustand der Zellen
  void render ()
  {
    int circlePositionX;
    float circlePositionY = height/2;    
    background (155,200,35);
    for (int i=0; i<cell.length; i++)
    {      
      noStroke();
      fill(255);
      circlePositionX= (i*cellWidth) + i*gap + edge;
      circlePositionY= (cell[i].state == 1) ? peakPosition : basePosition;
      ellipse(circlePositionX, circlePositionY, cellWidth, cellWidth);
    }
  }


  
  
  /*
  Run():
  1. Aktuelle Generation wird gerendert
  
  Wenn Kreise sich in einer diskreten Position befinden:
  2. Jede Zelle Berechnet Ihren neuen Zustand
  3. GenerationCount geht 1 nach oben
  
  */
  
  
  void run ()
  {
      render();
      
        for (int i=1; i<cell.length-1; i++)//lässt die Zellen am Rand aus und erzeugt eine statische "Wand" aus toten Zellen; //<>//
        {
          {
            cell[i].generateState();
          }
        }
        generationCount++; 
        delay (500);   
  }
}
