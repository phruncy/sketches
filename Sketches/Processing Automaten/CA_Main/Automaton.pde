class Automaton
{
  private int caRuleNumber; 
  private int [] ruleset = new int[8];
  private int generationCount;
  //Visuals
  private int cellWidth;//wird von eingabe im Main-Programm geliefert
  private int cellHeight;// ''
  private int rectPositionY; 
  private int fadingAmount = 0; //Verblassungsgrad für alternde Zellen
  
  
  
  //Zell-Array
  private Cell [] cell; 
  
  //Konstruktor
  public Automaton (int rule, int cellwidth, int celllength)
  {
    this.caRuleNumber = rule;
    this.cellWidth = cellwidth;
    this.cellHeight = celllength;
    this.generationCount= 0;
  }
  
  
  void clearAll()//bereinigt das Feld
  {
    for (int i=0; i<cell.length; i++) 
    {
      cell[i].state =0;
    }    
    background(0);
    initialiseCell();  
    generationCount = 0;    
  }
  
  
  //initialisiert die Zellen
  void initialise ()
  {
    convertRule(caRuleNumber);
    cell = new Cell [width/cellHeight];
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
    for (int i=0; i<cell.length; i++)
    {
      if (cell[i].state == 1)
      {
        fill(255 - (cell[i].age * fadingAmount)); //ältere Zellen werden weniger hell dargestellt
      }
      else 
      {
        fill (0);
      }
      noStroke();
      rectPositionY = generationCount*cellHeight;//Y-Position muss jedes mal neu berechnet werden!
      rect (i*cellWidth, rectPositionY, cellWidth, cellHeight);
    }
  }
  
  
  
  /*
  Run():
  1. Aktuelle Generation wird gerendert
  2. Jede Zelle Berechnet Ihren neuen Zustand
  3. GenerationCount geht 1 nach oben
  
  */
  void run ()
  {
    if (generationCount < height)
    {
      render();
      for (int i=1; i<cell.length-1; i++)//lässt die Zellen am Rand aus und erzeugt eine statische "Wand" aus toten Zellen;
      {
        cell[i].generateState();
      }
      generationCount++; 
      println(rectPositionY);
    }
  }
}
