class Automaton extends Observable 
{
  private int _generationCount;
  private int _cellCount;
  private int [] _ruleset = new int[8];
  private Cell [] _cell;
  private boolean _isCyclic;
  
  //Konstruktor
  
  public Automaton ()
  {
    this._generationCount = 0;
    _isCyclic = false;
  }
  
  /// Setter/getter
  
  //wird von ViewMode aufgerufen, wenn sich eine Änderung in den Grafischen Parametern ergibt
  public int getGenerationCount()
  {
    return _generationCount;
  }
  
  public void setCellCount(int NewCellCount)
  {
    _cellCount = NewCellCount;
  }
  
  public void setRuleSet (int [] newRuleset )
  {
    _ruleset = newRuleset;
  }
  
   public void setIsCyclic(boolean value)
  {
     _isCyclic = value;
  }
  
  
  /// Methoden
  
  // Stellt standardmäßig eine einzelne lebendige Zelle in der Mitte des Zellraums als Startwert ein.
  private void initialiseState()
  {
    _cell[_cellCount/5].setState(1);
  }
  
   void setNeighbours (Cell cell)
  {
    cell.leftNeighbour = _cell[cell._position-1];
    cell.rightNeighbour = _cell[cell._position+1];
  }
  
  //Methoden, die logisch den Wechsel zwischem berenztem und zyklischem Zellularraum ermöglichen
  ///verbindet die ersten und letzte Zelle eines Arrays per Nachbarschaftszuweisung zu einem Ring
  public void closeCircle()
  {
    _cell[0].setLeftNeighbour(_cell[_cell.length-1]);
    _cell[0].setRightNeighbour(_cell[1]);
    _cell[_cell.length-1].setLeftNeighbour(_cell[_cell.length-2]);
    _cell[_cell.length-1].setRightNeighbour(_cell[0]);
  }
  
  ///löscht die Nachbarchaftbeziehungen der ersten und letzten Zelle 
  public void disconnectCircle()
  {
    _cell[0].setLeftNeighbour(null);
    _cell[0].setRightNeighbour(null);
    _cell[_cell.length-1].setLeftNeighbour(null);
    _cell[_cell.length-1].setRightNeighbour(null);
  }
  
  /// setzt den Automaten zurück: setzt alle Zellparameter und _generationCount auf 0
  
  public void resetAutomaton()
  {
    for (int i=0; i<_cell.length; i++)
    {
      _cell[i].reset();
    }
    _generationCount = 0;
  }
  
  /// initialisiert den Automaten im Setup:
  /// ein neues Zell-Array wird erzeugt und all seine Werte werden auf 0 gesetzt.
  /// Die Nachbarn werden verknüpt
  /// Falls "Cyclic" aktiv ist, werden die Zellen mit index 0 und maximum ebenfalls miteinander verknüpft;
  public void initialise(int[]ruleSet, int cellCount)
  {   
    _ruleset = ruleSet;
    _cellCount = cellCount;
    _cell = new Cell[_cellCount];
    for (int i=0; i<_cell.length; i++)
    {
      _cell[i]= new Cell(0);
      _cell[i].setPosition(i);
    
      if (i>1 && i<_cell.length)
      {
        setNeighbours(_cell[i-1]);
      }
    }
    initialiseState();
  }
  
  
  /// berechnet den neuen Zustand des gesamten Automaten 
  /// Vor der Berechnung wird überprüft, ob ob die jeweilige Zelle über Nachbarn verfügt 
  /// Tote Randzellen im Nicht-zyklischen modus werden so ausgelassen
  public void generateGeneration()
  {    
    for (int i =0; i< _cell.length; i++)
    {
      if (_cell[i].leftNeighbour != null )
      {
        _cell[i].generateCellParameters();
      }
    }
    _generationCount++;
    println(_generationCount);
    setChanged();
    notifyObservers();
  }
}
