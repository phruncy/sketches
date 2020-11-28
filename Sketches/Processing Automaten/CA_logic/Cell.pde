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
  
  ///Klassenmethoden
  
  void setNeighbours ()
  {
    this.leftNeighbour = automaton._cell[this._position-1];
    this.rightNeighbour = automaton._cell[this._position+1];
  }
  
  //// Übergabeargumente sind die Zustände der beiden Nachbarzellen
  //// unbinary(triplet) gibt als Ergebnis den Index des ruleset[]-Array-Elements zurück,
  //// das den neuen Zellzustand enthält
  private int calculateState (int l,int r)
  {
    String triplet= "";
    triplet = triplet + l+this._state+r;
    return automaton._ruleset[unbinary(triplet)];
  }
  
  private void setAge ()
  {
    this._age = ((this._state ==1) && (this._formerState ==1))? this._age++ : 0; 
  }
  
  
  public void generateCellParameters()
  {
    int left = (this._position == 0)? leftNeighbour._state : leftNeighbour._formerState;
    int right = (this._position == (automaton._cell.length)-1)? rightNeighbour._formerState : rightNeighbour._state;
    
    this._formerState = this._state;
    this._state = calculateState (left, right);
    setAge();
  }  
    
 public void reset ()
 {
   this._state = 0;
   this._age = 0;
   this._formerState = 0;
 }
}
