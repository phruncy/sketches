class Cell
{
  private int state;
  private int formerState;
  //private int age;
  private int position;
  private Cell leftNeighbour;
  private Cell rightNeighbour;
  
  public Cell (int initialState)
  {
    this.state = initialState;
    this.formerState = 0;
    //this.age = 0;
  }
  
  void setNeighbours ()
  {
    this.leftNeighbour = cellularAutomaton.cell[this.position-1];
    this.rightNeighbour = cellularAutomaton.cell[this.position+1];
  }
  
  //führt die Regeln aus
  public int execute110 (int l, int m, int r)
  {    
    if ((l+m+r!=3)&&(m==1||r==1))
    {
      return 1;
    }
    return 0;    
  }
  
  //berechnet den neuen Zellzustand
  //wenn eine Zelle 1 ist und ihren Zustand beibehält: Alter um 1 erhöhen. 
  public void generateState ()
  { 
    int l;
    int r;
    /* Aufgrund der schrittweisen Berechnung der Zellzustände über eine for-Schleife 
      müssen die herangezogenen Zellzustände für die Randzellen eigens angepasst werden:
      Zelle 0 benötigt den derzeitigen Zustand von Zelle 13, da diese während ihrer eigenen Berechnung 
      noch nicht neu berechnet wurde; alle anderen Zellen benötigen den vorherigen Zustand ihres linken 
      Nachbarn, da dieser während ihrer eigenen
      Zelle 13 benötigt den vorherigen Zustand ihres rechten Nachbarn; alle anderen Zellen benötigen den 
      derzeitigen Zustand ihres rechten Nachbarn.
    */
    l =(this.position == 0)? leftNeighbour.state : leftNeighbour.formerState;
    r =(this.position == (cellularAutomaton.cell.length)-1)? rightNeighbour.formerState : rightNeighbour.state;
    this.formerState = this.state;
    this.state = execute110(l, this.state, r );
    /* alter der Zellen
    if (this.state == 1 && this.state==this.formerState )
    {
      age++;
    }
    else
    {
      age = 0;
    }*/
  }
  
  
}
