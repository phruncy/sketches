class DefaultViewModel extends Observable implements Observer
{
  // globale Variablen
  private Automaton _automaton;
  
  private int _cellSize = 2;//!!!!!!!!!!!! Wird später von GUI übergeben!
  private int _horizontalSpacing = 0;//"        "        "         "    "   "
  private int _edge = 0;//   " "   "           "         "    "   "
  private int _verticalSpacing;
  private boolean _runnable;
  
  /// Konstanten für Berechung der View:
  public final int _outputPanelTop = 100;
  public final int _outputPanelBottom =50;
  public final int _outputPanelEdgeLeft = 50;
  public final int _outputPanelEdgeRight =50;

  
  //Konstruktor
  public DefaultViewModel (Automaton automaton)
  {
    _automaton = automaton;
    _runnable = false;
  }
  
  public void update(Observable observable, Object arg )
  {
    setChanged();
    notifyObservers();
  }
  
  //Getter und Setter
  
  public void setCellSize(int newCellSize)
  {
    _cellSize = newCellSize;
  }
  
  public int getCellSize()
  {
    return _cellSize;
  }
  
  public boolean getRunnable()
  {
    return _runnable;
  }
  public void setRunnable(boolean value)
  {
    _runnable = value;
  }

  //Methoden
  /// berechnet die Länge des cell[] Arrays besierund auf der eingegebenen Zellgröße
  public int calculateCellNumber()
  {
    int numberOfCells = (getDisplayPanelSizeX ()- 2*_edge)/(_cellSize + _verticalSpacing); //!!!!!!!!!!!!
    return numberOfCells;
  }
  
  ///konvertiert die  dezimale Regelnummer in ein int-Array
  public int[] convertDecimalRule (int decimalRuleNumber) 
  {
    int [] newRuleSet = new int[8];
    int modulo = decimalRuleNumber;
    for (int n= 0; n<newRuleSet.length; n++)
    {
      newRuleSet [n] = modulo % 2;
      modulo = modulo/2;
    }
    return newRuleSet;
  }
  
  /// Methoden zur Berechung der Position der grafischen Zellen
  public int getCellPositionX (int indexOfCell)
  {
    int posX = indexOfCell* (_horizontalSpacing + _cellSize) + _edge + _outputPanelEdgeLeft;
    return posX;
  }
  
  public int getCellPositionY (Automaton automaton)
  {
    int posY = (automaton.getGenerationCount()+ _verticalSpacing)* _cellSize + _outputPanelTop;
    return posY;
  }
  
  
  
  //// Methoden zur Einstellung von Größen- und Farbparametern
  ///gibt die Farbe der in der View ausgegebenen Zelle zurück
  public color generateCellColor()
  {
    color cellColor = (255); ////!!!! Später von der Gui aus einstellbar!
    return cellColor;
  }
  
  public color getBackgroundColor()
  {
    color backgroundColor = (100);
    return backgroundColor;
  }
  
  public color getDisplayPanelColor()
  {
    color displayColor = (0);
    return displayColor;
  }
  
  public int getDisplayPanelSizeX ()
  {
    int displayPanelSizeX = width - (_outputPanelEdgeLeft + _outputPanelEdgeRight);
    return displayPanelSizeX;
  }

  public int getDisplayPanelSizeY ()
  {
    int displayPanelSizeY = height - (_outputPanelBottom + _outputPanelTop);
    return displayPanelSizeY;
  }
  
  
 
}
