class Automaton
{
  private int caRuleNumber; 
  private int [] ruleset = new int[8];
  private int generationCount;
  //Visuals
  private int cellWidth;//wird von eingabe im Main-Programm geliefert
  private int cellHeight;

  
  
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
    convertRule(caRuleNumber);
    for (int i=0; i<cell.length; i++) 
    {
      cell[i].state =0;
    }    
    background(255);
    initialiseCell();  
    generationCount = 0;    
  }  
  
  //initialisiert die Zellen
  //Array Länge: (Fenstergröße - rand an beiden Seiten) : (Zellgröße + Zellabstand)
  void initialise ()
  {
    convertRule(caRuleNumber);
    cell = new Cell [24];
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
    int r;
    int g;
    int b;
    background (255);
    for (int i=0; i<cell.length; i++)
    {
      
      r = unbinary(calculateR());
      g = unbinary(calculateG());
      b = unbinary(calculateB());
      noStroke();
      fill (r,g,b);
      rect(width/2 - cellWidth/2, height/2 - cellWidth/2, cellWidth, cellWidth);
    }
  }

  String calculateR ()
  {
    String r = "";
    for (int i = 0; i<7; i++)
    {
      r = r+ cell[i].state;
    }
    return r;
  }
  
  String calculateG ()
  {
    String g = "";
    for (int i = 8; i<15; i++)
    {
      g = g+ cell[i].state;
    }
    return g;
  }
  
  String calculateB ()
  {
    String b = "";
    for (int i = 16; i<cell.length; i++)
    {
      b = b+ cell[i].state;
    }
    return b;
  }
  
  
  
  void run ()
  {
      render();
     
        for (int i=1; i<cell.length-1; i++)//lässt die Zellen am Rand aus und erzeugt eine statische "Wand" aus toten Zellen;
        {
          {
            cell[i].generateState();
          }
        }
        generationCount++; 
        delay (100);
      //}    
  }
}
