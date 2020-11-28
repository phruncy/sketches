class Cell
{
  private int state;
  private int formerState;
  private int age;
  private int position;
  private Cell leftNeighbour;
  private Cell rightNeighbour;
  
  public Cell (int initialState)
  {
    this.state = initialState;
    this.formerState = 0;
    this.age = 0;
  }
  
  void setNeighbours ()
  {
    this.leftNeighbour = cellularAutomaton.cell[this.position-1];
    this.rightNeighbour = cellularAutomaton.cell[this.position+1];
  }
  
  //führt die Regeln aus
  public int executeRules (int l, int m, int r)
  {
    
    if (l==1 && m == 1 && r==1) {return cellularAutomaton.ruleset [7];}
    if (l==1 && m == 1 && r==0) {return cellularAutomaton.ruleset [6];}
    if (l==1 && m ==0 && r== 1) {return cellularAutomaton.ruleset [5];}
    if (l==1 && m ==0 && r== 0) {return cellularAutomaton.ruleset [4];}
    if (l==0 && m ==1 && r== 1) {return cellularAutomaton.ruleset [3];}
    if (l==0 && m ==1 && r== 0) {return cellularAutomaton.ruleset [2];}
    if (l==0 && m ==0 && r== 1) {return cellularAutomaton.ruleset [1];}
    if (l==0 && m ==0 && r== 0) {return cellularAutomaton.ruleset [0];}   
    else {return 0;} 
    
  }
  
  //berechnet den neuen Zellzustand
  //wenn eine Zelle 1 ist und ihren Zustand beibehält: Alter um 1 erhöhen. 
  public void generateState ()
  {
    this.formerState = this.state;
    this.state = executeRules(leftNeighbour.formerState, this.state, rightNeighbour.state );
    if (this.state == 1 && this.state==this.formerState )
    {
      age++;
    }
    else
    {
      age = 0;
    }
  }
  
  
}
