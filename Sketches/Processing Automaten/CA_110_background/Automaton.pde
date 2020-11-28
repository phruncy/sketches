class Automaton
{
  private int caRuleNumber; 
  private int generationCount;
  //Visuals
  private int cellWidth;//wird von eingabe im Main-Programm geliefert
  private int rectPositionY; 

  //Zell-Array
  private Cell [] cell; 
  
  //Eingabe-Muster
  private int [] backgroundPattern = new int []{1,1,1,1,1,0,0,0,1,0,0,1,1,0};
  
  //Konstruktor
  public Automaton (int cellwidth)
  {
    this.cellWidth = cellwidth;
    this.generationCount= 0;
  }
  
  
  void clearAll()//bereinigt das Feld
  {
    for (int i=0; i<cell.length; i++) 
    {
      cell[i].state =0;
    }    
    background(0);
    initialiseState();  
    generationCount = 0;    
  }
    
  //initialisiert die Zellen
  void initialise ()
  {
    cell = new Cell [width/cellWidth];
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
    //schließt das Ringförmige Array
    cell[0].leftNeighbour = cell[cell.length-1];
    cell[0].rightNeighbour = cell[1];
    cell[cell.length-1].leftNeighbour = cell[cell.length-2];
    cell[cell.length-1].rightNeighbour = cell[0];
    clearAll();
  }
  
  //definiert den Startzustand
  void initialiseState() 
  {
    int v = 0;
    for (int i =0; i<40; i++)
    {
       for (int n = 0; n<14; n++)
       {
         cell[v+n].state= backgroundPattern[n];
         println (v);
       }
       v += 14; //<>//
    }
  }
    
 
  
  //berechnet die grafische Ausgabe aus dem Zustand der Zellen
  void render ()
  {
    for (int i=0; i<cell.length; i++)
    {
      fill(255);
      noStroke();
      rectPositionY = generationCount*cellWidth;//Y-Position muss jedes mal neu berechnet werden!
      if (cell[i].state ==1)
      {
        rect (i*cellWidth, rectPositionY, cellWidth, cellWidth);
      }
    }
  }
  
  /*
  Run(): führt die gesamt funktion des Automten aus
  1. Aktuelle Generation wird gerendert
  2. Jede Zelle Berechnet Ihren neuen Zustand
  3. GenerationCount geht 1 nach oben
  
  */
  void run ()
  {
    {
      render();
      for (int i=0; i<cell.length; i++)
      {
        cell[i].generateState(); //<>//
      }
      generationCount++; 
      if (generationCount >=1000)
      {
        println("done!");
        exit();
      }
      else
      {
        println("hetz mich nicht " + generationCount);
      }

    }
  }
}
