class DefaultViewMode extends Observable implements Observer
{
  //Konstruktor
  public DefaultViewMode ()
  {
    this.addObserver(view);
  }
  
  public void update(Observable observable, Object arg )
  {
    
  }
  
  /// berechnet die Länge des cell[] Arrays
  public int calculateCellNumber()
  {
    int numberOfCells = 10;///!!!!!!!!!!!!
    return numberOfCells;
  }
  
  public int getCellSize(int cellSize)
  {
    return cellSize;
  }
  
  
 
}
