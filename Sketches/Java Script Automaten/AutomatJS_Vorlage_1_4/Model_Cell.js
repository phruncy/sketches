//Cell Class
/// Die Kernfunktion des Automaten wird von den Zellen selbst ausgeführt:
/// Jedes Zellobjekt kennt seinen Nachbarn und kann seinen neuen Zustand 
/// selbstständig berechnen
function Cell(initialState, automaton) {
  this._automaton = automaton;
  this._state = initialState;
  this._formerState = 0;
  this._age = 0;
  this._position = undefined;
  this.leftNeighbour = null;
  this.rightNeighbour = null;
  this._history = [];
  
  //Methods
  this.setState = function(newState){
    this._state = newState;
  }
  this.setPosition = function(position){
    this._position = position;
  }
  this.setRightNeighbour = function(cell){
    this.rightNeighbour = cell;
  };
  
  this.setLeftNeighbour = function(cell){
    this.leftNeighbour = cell;
  };
  
  ///// Überträgt das Regelwerk des Automaten auf eine Zelle:
  ///// Der Rückgabewert der FUnktion ist der neue Zellzustand.
  ///// Die Übergabeparameter left und right sind die Zustände der linken und rechten Nachbarzellen.
  ///// Über den String "Triplet" wird die Nachbarschaftskonstellation einer Zelle zu einem bestimmten Zeitpunkt als Binärzahl ermittelt.
  ///// Der Wert der ermittelten Binärzahl entspricht dem Index im _ruleset-Array des Automaten, der die information über den neuen Zellzustand der mittleren Zelle 
  ///// für diese Nachbarschaftkonstellation enthält.
  this.calculateState= function(left,right)
  {
    let triplet = "";
    triplet = triplet + left + this._state +  right;
    let result = this._automaton._ruleset[parseInt(triplet,2)];
    return result;
  };

  ///// Der eigentliche Automaten- Algorithmus:
  ///// Jede Zelle 
  ///// Der neu errechnete Zustand wird ausßerdem der Zustandvserlaufs der Zelle hinzugefügt
  this.generateCellParameters= function(){
    let left = (this._position ==0)? this.leftNeighbour._state : this.leftNeighbour._formerState;
    let right = (this._position == (this._automaton._cells.length)-1)? this.rightNeighbour._formerState: this.rightNeighbour._state;
    this._formerState= this._state;
    this._state = this.calculateState(left, right);
    this.setAge();
    this._history.push(this._state);
    console.log("generated");
  };
  
  this.setAge = function(){
    this._age = ((this._state==1)&&(this._formerState==1))? this._age++ : 0;
  };
  
  this.reset = function(){
    this._state = 0;
    this._age = 0;
    this._formerState = 0;
    this._history = [];
  };  
}
