class Cell
{
  private int _state;
  private int _formerState;
  private int _age;
  private int _position;
  private Cell leftNeighbour;
  private Cell rightNeighbour;
  
    ///Konstruktor
  
  public Cell (int initialState)
  {
    this._state = initialState;
    this._formerState = 0;
    this._age=0;
  }
  
  ///getter + setter
  
  public int getState()
  {
    return this._state;
  }
  
  public void setState(int state)
  {
    this._state = state;
  }
  
  public int getPosition()
  {
    return this._position;
  }
  
  public void setPosition(int position)
  {
    this._position = position;
  }
  
  public int getAge()
  {
    return this._age;
  }
  
  public void setRightNeighbour (Cell cell)
  {
    this.rightNeighbour = cell;
  }
  
  public void setLeftNeighbour (Cell cell)
  {
    this.leftNeighbour = cell;
  }
  
  ///Klassenmethode
  
  //// Übergabeargumente sind die Zustände der beiden Nachbarzellen
  //// unbinary(triplet) gibt als Ergebnis den Index des ruleset[]-Array-Elements zurück,
  //// das den neuen Zellzustand enthält
  private int calculateState (int l,int r)
  {
    String triplet= "";
    triplet = triplet + l+this._state+r;
    return automaton._ruleset[unbinary(triplet)];
  }
  
  
  public void generateCellParameters()
  {
    int left = (_position == 0)? leftNeighbour._state : leftNeighbour._formerState;
    int right = (_position == (automaton._cell.length)-1)? rightNeighbour._formerState : rightNeighbour._state;
    
    _formerState = _state;
    _state = calculateState (left, right);
    setAge();
  }  
  
  
 private void setAge ()
  {
    _age = ((_state ==1) && (_formerState ==1))? _age++ : 0; 
  }
    
 public void reset ()
 {
   _state = 0;
   _age = 0;
   _formerState = 0;
 }
}
