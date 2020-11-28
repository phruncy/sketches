var automaton;
var viewModel;
var view;
var gui;

/// vorläufig!
var ruleNr = 110;

function setup ()
{   
  createCanvas(1000,700);
    
  // Setup der MVVM-Komponenten
  automaton = new Automaton();
  viewModel = new DefaultViewModel(automaton);
  view = new DefaultView(viewModel);
  gui = new Gui(automaton, viewModel,view);
  
  //Setup Observer
  automaton.addObserver(viewModel);
  viewModel.addObserver(view);
  viewModel.addObserver(gui);
  
  //Initalisierung des Automaten
  automaton.initialise(viewModel.convertDecimalRule (ruleNr), viewModel.calculateCellNumber());
  println ("setup done");
  
  //Initialisierung der Grafischen Ausgabe
  view.initialise();
}

function draw()
{
    //if (viewModel._runnable)
    //{
      //if(view.getIsRendered())
      //{
       automaton.generateGeneration();
      //}  
    //}
  } 

/////Automatenlogik///////
//Konstruktor
class Automaton {
  constructor() {
    this._generationCount = 0;
    this._ruleset = new Array(8);
    this._isCyclic = false;
    /// Setter/getter
    //wird von ViewMode aufgerufen, wenn sich eine Änderung in den Grafischen Parametern ergibt
    this.getGenerationCount = function () 
    {
      return this._generationCount;
    };
    this.setCellCount = function (newCellCount) 
    {
      this._cellCount = NewCellCount;
    };
    this.setRuleSet = function (newRuleset) 
    {
      this._ruleset = newRuleset;
    };
    this.setIsCyclic = function (value) 
    {
      this._isCyclic = value;
    };
    /// Methoden
    // Stellt standardmäßig eine einzelne lebendige Zelle in der Mitte des Zellraums als Startwert ein.
    this.initialiseState = function () 
    {
      this._cell[_cellCount / 2].setState(1);
    };
    this.setNeighbours = function (cell) 
    {
      cell.leftNeighbour = this._cell[cell._position - 1];
      cell.rightNeighbour = this._cell[cell._position + 1];
    };
    /// initialisiert den Automaten im Setup:
    /// ein neues Zell-Array wird erzeugt und all seine Werte werden auf 0 gesetzt.
    /// Die Nachbarn werden verknüpt
    /// Falls "Cyclic" aktiv ist, werden die Zellen mit index 0 und maximum ebenfalls miteinander verknüpft;
    this.initialise = function (ruleSet, cellCount) 
    {
      this._ruleset = ruleSet;
      this._cellCount = cellCount;
      this._cell = new Array(this._cellCount);
      for (var i = 0; i < this._cell.length; i++) 
      {
        this._cell[i] = new Cell(0);
        this._cell[i].setPosition(i);
        if (i > 1 && i < this._cell.length) 
        {
          setNeighbours(this._cell[i - 1]);
        }
      }
      initialiseState();
    };
    //Methoden, die logisch den Wechsel zwischem berenztem und zyklischem Zellularraum ermöglichen
    ///verbindet die ersten und letzte Zelle eines Arrays per Nachbarschaftszuweisung zu einem Ring
    this.closeCircle = function () 
    {
      this._cell[0].setLeftNeighbour(_cell[_cell.length - 1]);
      this._cell[0].setRightNeighbour(_cell[1]);
      this._cell[_cell.length - 1].setLeftNeighbour(_cell[_cell.length - 2]);
      this._cell[_cell.length - 1].setRightNeighbour(_cell[0]);
    };
    ///löscht die Nachbarchaftbeziehungen der ersten und letzten Zelle 
    this.disconnectCircle = function () 
    {
      this._cell[0].setLeftNeighbour(null);
      this._cell[0].setRightNeighbour(null);
      this._cell[_cell.length - 1].setLeftNeighbour(null);
      this._cell[_cell.length - 1].setRightNeighbour(null);
    };
    /// setzt den Automaten zurück: setzt alle Zellparameter und _generationCount auf 0
    this.resetAutomaton = function () 
    {
      for (var i = 0; i < this._cell.length; i++) {
        this._cell[i].reset();
      }
      this._generationCount = 0;
    };
    /// berechnet den neuen Zustand des gesamten Automaten 
    /// Vor der Berechnung wird überprüft, ob ob die jeweilige Zelle über Nachbarn verfügt 
    /// Tote Randzellen im Nicht-zyklischen modus werden so ausgelassen
    this.generateGeneration = function () 
    {
      for (var i = 0; i < this._cell.length; i++) {
        if (this._cell[i].leftNeighbour != null) {
          this._cell[i].generateCellParameters();
        }
      }
      this._generationCount++;
      console.log(this._generationCount);
      ///setChanged();
      ///notifyObservers();
    };
  }
}


///Konstruktor 
class Cell {
  constructor(initialState) 
  {
    this._state = initialState;
    this._formerState = 0;
    this._age = 0;
    ///getter + setter
    this.getState = function () {
      return this._state;
    };
    this.setState = function (state) {
      this._state = state;
    };
    this.getPosition = function () {
      return this._position;
    };
    this.setPosition = function (newPosition) {
      this._position = newPthis.osition;
    };
    this.getAge = function () {
      return this._age;
    };
    this.setRightNeighbour = function (cell) {
      this.rightNeighbour = cell;
    };
    this.setLeftNeighbour = function (cell) {
      this.leftNeighbour = cell;
    };
    ///Klassenmethodethis.
    //// Übergabeargumente sind die Zustände der beiden Nachbarzellen
    //// unbinary(triplet) gibt als Ergebnis den Index des ruleset[]-Array-Elements zurück,
    //// das den neuen Zellzustand enthält
    this.calculateState = function (l, r) {
      var triplet = "";
      triplet = triplet + l + this._state + r;
      return automaton._ruleset[unbinary(triplet)];///!
    };
    this.generateCellParameters = function () {
      var left = (_position == 0) ? leftNeighbour._state : leftNeighbour._formerState;
      var right = (_position == (automaton._cell.length) - 1) ? rightNeighbour._formerState : rightNeighbour._state;
      this._formerState = _state;
      this._state = calculateState(left, right);
      this.setAge();
    };
    this.setAge = function () {
      this._age = ((this._state == 1) && (this._formerState == 1)) ? this._age++ : 0;
    };
    this.reset = function () {
      this._state = 0;
      this._age = 0;
      this._formerState = 0;
    };
  }
}

////ViewModel
class DefaultViewModel 
{
  constructor(automaton) {
    this._automaton = automaton;
    this._runnable = false;
    this._cellSize = 2; //!!!!!!!!!!!! Wird später von GUI übergeben!
    this._horizontalSpacing = 0; //"        "        "         "    "   "
    this._edge = 0; //   " "   "           "         "    "   "
    this._verticalSpacing = 0;
    //Konstanten für die Berechnung der view
    this._outputPanelTop = 100;
    this._outputPanelBottom = 50;
    this._outputPanelEdgeLeft = 50;
    this._outputPanelEdgeRight = 50;
    /*
    public void update(Observable observable, Object arg )
    {
      setChanged();
      notifyObservers();
    }*/
    //Getter und Setter
    this.setCellSize = function (newCellSize) {
      this._cellSize = newCellSize;
    };
    this.getCellSize = function () {
      return this._cellSize;
    };
    this.getRunnable = function () {
      return this._runnable;
    };
    this.setRunnable = function (value) {
      this._runnable = value;
    };
    //Methoden
    /// berechnet die Länge des cell[] Arrays besierund auf der eingegebenen Zellgröße
    this.calculateCellNumber = function () {
      numberOfCells = (getDisplayPanelSizeX() - 2 * _edge) / (_cellSize + _verticalSpacing); //!!!!!!!!!!!!
      return numberOfCells;
    };
    ///konvertiert die  dezimale Regelnummer in ein int-Array
    this.convertDecimalRule = function (decimalRuleNumber) {
      newRuleSet = new Array(8);
      modulo = decimalRuleNumber;
      for (var n = 0; n < newRuleSet.lenthis.gth; n++) {
        newRuleSet[n] = modulo % 2;
        modulo = modulo / 2;
      }
      return newRuleSet;
    };
    /// Methoden zur Berechung der Position der grafischen Zellen
    this.getCellPositionX = function (indexOfCell) {
      posX = indexOfCell * (this._horizontalSpacing + this._cellSize) + this._edge + this._outputPanelEdgeLeft;
      return posX;
    };
    this.getCellPositionY = function () {
      posY = (this._automaton.getGenerationCount() + this._verticalSpacing) * this._cellSize + this._outputPanelTop;
      return posY;
    };
    //// Methoden zur Einstellung von Größen- und Farbparametern
    ///gibt die Farbe der in der View ausgegebenen Zelle zurück
    this.generateCellColor = function () {
      cellColor = (255); ////!!!! Später von der Gui aus einstellbar!
      return cellColor;
    };
    this.getBackgroundColor();
    {
      backgroundColor = (100);
      return backgroundColor;
    }
    this.getDisplayPanelColor();
    {
      displayColor = (0);
      return displayColor;
    }
    this.getDisplayPanelSizeX();
    {
      displayPanelSizeX = width - (this._outputPanelEdgeLeft + this._outputPanelEdgeRight);
      return displayPanelSizeX;
    }
    this.getDisplayPanelSizeY();
    {
      displayPanelSizeY = height - (this._outputPanelBottom + this._outputPanelTop);
      return displayPanelSizeY;
    }
  }
}
/////View
class DefaultView 
{
  constructor(viewModel) {
    this.vm = viewModel;
    _isRendered = true;
    // Setter/ Getter
    this.setIsRendered(value);
    {
      this._isRendered = value;
    }
    this.getIsRendered();
    {
      return this._isRendered;
    }
    /// Methoden 
    /*public void update(Observable observable, Object arg)
    {
      render(automaton);
    }*/
    //Setup der grafischen Anzeige
    this.initialise = function () {
      background(this.vm.getBackgroundColor());
      fill(this.vm.getDisplayPanelColor());
      rect(this.vm._outputPanelEdgeLeft, this.vm._outputPanelTop, this.vm.getDisplayPanelSizeX(), this.vm.getDisplayPanelSizeY());
    };
    ///leert die grafische Anzeige und setzt den Automaten zurück
    this.clearAll = function (automaton) {
      automaton.resetAutomaton();
      background(this.vm.getBackgroundColor());
      fill(this.vm.getDisplayPanelColor());
      rect(this.vm._outputPanelEdgeLeft, this.vm._outputPanelTop, this.vm.getDisplayPanelSizeX(), this.vm.getDisplayPanelSizeY());
      this.vm.setRunnable(false);
    };
    ///rendert die aktuelle Generation
    this.render = function (automaton) {
      for (var i = 0; i < automaton._cell.length; i++) {
        fill(this.vm.generateCellColor());
        noStroke();
        if (automaton._cell[i]._state == 1) {
          rect(this.vm.getCellPositionX(i), this.vm.getCellPositionY(automaton), this.vm.getCellSize(), this.vm.getCellSize());
        }
        setIsRendered(true);
      }
    };
  }
}
////Gui
