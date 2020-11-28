class Automaton extends Observable 
{
  private int _decimalRuleNumber;
  private int _generationCount;
  private int _cellCount;
  private int [] _ruleset = new int[8];
  private Cell [] _cell;
  
  //Konstruktor
  
  public Automaton (int _rulenumber, int _cellCount )
  {
    this.addObserver(viewMode);
   /// this.addObserver(gui);
    this._cellCount = _cellCount; //<>//
    this._generationCount = 0;
    this._decimalRuleNumber = _rulenumber;
  }
  
  /// Setter
  
  //wird von ViewMode aufgerufen, wenn sich eine Änderung in den Grafischen Parametern ergibt
  public void setCellCount(int NewCellCount)
  {
    this._cellCount = NewCellCount;
  }
  
  public void setRuleSet (int [] newRuleset )
  {
    this._ruleset = newRuleset;
  }
  
  
  // Methoden
  
  //für später: Action Listerner einbauen
  public boolean isCyclic()
  {
    if (1==2)///füllen!)
    {
    return true;
    }
    else {return false;}
  }
  
  //konvertiert die Regelnummer in ein int-Array
  public void convertDecimalRule (int decimalRuleNumber) 
  {
    int modulo = decimalRuleNumber;
    for (int n= 0; n<_ruleset.length; n++)
    {
      _ruleset [n] = modulo % 2;
      modulo = modulo/2;
    }
  }
  
  public void convertTickBoxRule(/*tickbox info??*/)
  {
    
  }
  
  /// setzt den Automaten zurück
  public void clearAutomaton()
  {
    for (int i=0; i<_cell.length; i++)
    {
      _cell[i].reset();
    }
    
  }
  
  /// initialisiert den Automaten im Setup:
  /// ein neues Zell-Array wird erzeugt und all seine Werte werden auf 0 gesetzt.
  /// Die Nachbarn werden verknüpt
  public void initialise()
  {
    convertDecimalRule(_decimalRuleNumber);
    _cell = new Cell[_cellCount];
    for (int i=0; i<_cell.length; i++)
    {
      _cell[i]= new Cell(0);
      _cell[i].setPosition(i);
    
      if (i>1)
      {
        _cell[i-1].setNeighbours();
      }
    }
    if (isCyclic())
     {
      _cell[0].leftNeighbour = _cell[_cell.length-1];
      _cell[0].rightNeighbour = _cell[1];
      _cell[_cell.length-1].leftNeighbour = _cell[_cell.length-2];
      _cell[_cell.length-1].rightNeighbour = _cell[0];
     }  
  }
  
  public void run()
  {
    
    for (int i =1; i< _cell.length-1; i++) //<>//
    {
      _cell[i].generateCellParameters();
    }
    _generationCount++;
    println(_generationCount);
  }
}
