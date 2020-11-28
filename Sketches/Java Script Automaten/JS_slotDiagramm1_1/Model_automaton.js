/// Automaton Klasse
/*
  Das Automaten-Objekt existiert nur einmal und dient als Steuerungs- und Containerobjekt für die Automatenzellen.
  Der Zellularraum wird durch ein eindimensionales Array simuliert, dass die Zellobjekte enthält. Der zellularraum kann
  dabei zyklisch oder oder durch nachbarlose "tote" Zellen am Anfang und Ende des Arrays begrenzt sein.
  Die Startkonfiguration des Automaten ist nicht zyklisch.
*/
function Automaton() {
  let self = this;
  this._generationCount = 0;
  this._cells = [];
  this._ruleset = [];
  this._isCyclic = false;
  ////legt fest, ob die View den Rendervorgang beendet hat
  this._isRendered = false;
  this.observers = [];
  
  //Getter/Setter
  this.setIsCyclic = function(value){
    this._isCyclic = value;
  }

  this.setCellNumber = function (value){
    this._cellCount = value;
  }

  ///Observer Pattern - Methoden
  this.subscribe = function (observer)
  {
   self.observers.push(observer);
  }

  this.unsubscribe = function(observer)
  {
    this.observers = this.observers.filter(subscriber => subscriber !== observer);
  }

  this.notifyObservers = function()
  {
   self.observers.forEach(function(observer){observer.update(self)});
  }

  

  /* Der Automat füllt sein ZellArray mit der ihm übergebenen Anzahl an Zellen und lädt die übergebene
     Startregel in das _rulset-Array.
     Die Zellen definieren nacheinander ihre Nachbarn. Der Automat wird nicht-zyklisch initialisiert, d.h. die 
     Nachbarn der Randzellen werden mit null initialisiert.   
  */
  this.initialise = function(rule, cellNumber){
    this._ruleset = rule;
    this._cellCount = cellNumber;
    for (let i = 0; i<this._cellCount; i++)
    {
      this._cells.push(new Cell(0,this));
      this._cells[i].setPosition(i);
      if (i>1 && i<this._cellCount)
      {
        this.setNeighbours(this._cells[i-1]);
      }
    }
    this.disconnectRingGrid();
    this.initialiseState();
  };
  
  //// bringt den Automaten in seinen Initialzustand
  this.initialiseState = function()
  {
    const index = parseInt(this._cells.length/2);
    this._cells[index].setState(1);
  };
  
  this.setNeighbours = function(cell){
    cell.leftNeighbour = this._cells[cell._position-1];
    cell.rightNeighbour = this._cells[cell._position+1];
  };
  
  /// verbindet die jeweils erste und letzte zelle des Zell-Arrays als Nachbarn miteinander und schließt den linearen Zellularraum so ringförmig
  this.closeRingGrid = function(){
    this._cells[0].setLeftNeighbour(this._cells[this._cells.length-1]);
    this._cells[0].setRightNeighbour(this._cells[1]);
    this._cells[this._cells.length-1].setLeftNeighbour(this._cells[this._cells.length-2]);
    this._cells[this._cells.length-1].setRightNeighbour(this._cells[0]);
  };
  
  /// löst die nachbarschaftverbindungen der ersten und letzten Zelle des Arrays
  this.disconnectRingGrid = function(){
    this._cells[0].setLeftNeighbour(null);
    this._cells[0].setRightNeighbour(null);
    this._cells[this._cells.length-1].setLeftNeighbour(null);
    this._cells[this._cells.length-1].setRightNeighbour(null);
  };

  this.setIsViewModelReady = function(value)
  {
    this._isRendered = value;
  }
  
  ///setzt die Attribute jeder einzelnen Zelle auf null zurück und setzt zusätzlich die Generationenzahl auf 0 zurück
  ///Is Rendered wird auf false gesetzt, um  zu verhindenr, dass beim Neustart die erste generation beim rendern übersprungen wird
  this.resetAutomaton = function(){
    for(let i=0; i<this._cells.length; i++){
      this._cells[i].reset();
    }
    this._generationCount = 0;
    this.initialiseState();
    this._isRendered = false;
  };
  
  /*
    Ruft die generateParamters-Methode jeder einzelnen Zelle auf.
    Zellen ohne Nachbarn berechnen ihren zustand nicht neu, sodass diese im nicht-zyklischen Modus eine statische Begrenzung
    des Zellraums nach links und rechts darstellen.
    Die Methode wird nur ausgeführt, wenn '_isRendered' vom viewModel auf 'true' gesetzt wurde.
    Für Darstellungen in der View, die länger als einen Frame pro Generation benötigen, wird
    die neue Generation somit erst berechnet, wenn das Rendering der vorherigen Generation abgeshclossen ist.
  */
  this.generateGeneration = function()
  {
   if(this._isRendered)
   {
      for(let i =0; i<this._cells.length; i++)
      {
        if(this._cells[i].leftNeighbour != null)
        {
          this._cells[i].generateCellParameters();
        }
      }
      this._generationCount++;
    };  
    this.notifyObservers();  
  }
}
