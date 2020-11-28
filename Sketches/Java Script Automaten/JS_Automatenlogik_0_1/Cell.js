function Cell()
{
  this._state;
  this._formerState;
  this._age;
  this._arrayPosition;
  this._rightNeighbour;
  this._leftNeighbour;
  
  constructor()
  {
    this._state = 0;
    this._formerState = 0;
    this._age = 0;
  }
  
  //Die Zelle definiert ihre Nachbarn
  function setNeighbours()
  {
     this._leftNeighbour = (this._position === 0)? automaton.cell[automaton.cell.length]: automaton.cell[this._position-1];
     this._rightNeighbour = (this.position === automaton.cell[automaton.cell.length])? automaton.cell[0] : automaton.cell[this._position+1];
  }
  
  // gibt den neuen Zustand einer Zelle ausgehend vom Zustand ihres triplets zurück
  function executeRules(l,m,r)
  {
    var triplet = ''+ l+m+r;
    return automaton.ruleset[parseInt(triplet, 10)];
  }
  
  // aktualsiert alle Eigenschaften eines Zellobjektes
  function generateState() 
  {
    this._formerState = this._state;
    this._state = executeRules(l,m,r);
    if (this._state ===1 && this._formerState===1)
    {
      age++;
    }
    else
    {
      age = 0;
    }
  }
  
  
}
