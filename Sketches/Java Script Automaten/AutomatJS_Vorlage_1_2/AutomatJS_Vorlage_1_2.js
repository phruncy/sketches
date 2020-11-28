var automaton;
var viewmodel;
var view ;
var gui;
var canvas;

function setup() {
canvas = createCanvas(500,500);
background(0);

///Object-Instanziierung
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
view = new View(viewmodel);
gui = new Gui(viewmodel, view);

//Object Initialsisierung von unten (Model) nach Oben (Grafische Darstellung)
automaton.initialise(viewmodel.convertDecimalRule(150), automaton.setCellNumber(100));
viewmodel.initialise();
view.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
viewmodel.subscribe(view);

noLoop(); //Draw soll erst durch Klicken auf den Run-Button ausgeführt werden
////////////////////////Setup Ende///////////////////////////////////////////////////////////////
}

function draw() 
{     
  automaton.generateGeneration();
}

function windowResized()
{
  resizeCanvas(windowWidth,windowHeight);
}

////////////////////////////////////////////////Automatenlogik//////////////////////////////////////////////
/// Automaton class
function Automaton() {
  let self = this;
  this._generationCount = 0;
  this._cells = [];
  this._ruleset = [];
  this.isCyclic = false;
  this._isRendered = true;

  this.observers = [];
  
  //Getter/Setter
  this.setIsCyclic = function(value){
    this._isCyclic = value;
  }

  this._setCellNumber = function (value)
  {
    this._cellCount = value;
  }

  //Observer Pattern - Methoden
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

  
  //Klassenmethoden
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
    console.log("initialised");
  };
  
  this.initialiseState = function()
  {
    const index = parseInt(this._cells.length/2);
    this._cells[index].setState(1);
  };
  
  this.setNeighbours = function(cell){
    cell.leftNeighbour = this._cells[cell._position-1];
    cell.rightNeighbour = this._cells[cell._position+1];
  };
  
  this.closeRingGrid = function(){
    this._cells.setLeftNeighbour(this._cells[this._cells.length-1]);
    this._cells.setRightNeighbour(this._cells[1]);
    this._cells[this._cells.length-1].setLeftNeighbour(this._cells[this-_cells.length-2]);
    this._cells[this._cells.length-1].setRightNeighbour(this._cells[0]);
  };
  
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
  
  this.resetAutomaton = function(){
    for(let i=0; i<this._cells.length; i++){
      this._cells[i].reset();
    }
    this._generationCount = 0;
  };
  
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

///Cell Class
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
  
  this.calculateState= function(left,right)
  {
    let triplet = "";
    triplet = triplet + left + this._state +  right;
    let result = this._automaton._ruleset[parseInt(triplet,2)];
    return result;
  };
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
/////////////////////////////////////////Ende Automatenlogik////////////////////////////////////////////

/////////////////////////////////////////Grafische Ausgabe////////////////////////////////////////////////

function ViewModel(automato) 
{
  let self = this; ///kann benutzt werden, wenn die Bezeichnung "this" missverständlich ist
  this._automaton = automato;
  this._cellSize = 0;
  this._horizontalSpacing = 0;
  this._edge = 0;
  this._isLooping = false;
  this.observers = [];
  
  this._outputPanelTop = 100;
  this._outputPanelBottom =50;
  this._outputPanelEdgeLeft = 50;
  this._outputPanelEdgeRight =50;
  
  //Observer Pattern Methoden
  this.update = function(data)
  {
    this.notifyObservers();
  };

  this.subscribe = function(newObserver)
  {
    this.observers.push(newObserver);
  };

  this.unsubscribe = function(observer)
  {
    this.observers.filter(subscriber => subscriber !== observer);
  }

  this.notifyObservers = function(data)
  {
    self.observers.forEach(function(observer){observer.update(self)});
  }

  //Klassenmethoden
  this.initialise = function()
  {
  }

  this.calculateCellSize = function ()
  {
    this._cellSize = width/ this._automaton.cellCount;
  }
  
  ///vermittelt den Wert von view._isRendered zwischen view und Automatenlogik
  this.mediateIsRendered = function (value)
  {
    const givenValue = value;
    this._automaton.setIsViewModelReady(givenValue);
  }

  this.setIsLooping = function(value)
  {
    console.log("hello");
    this._isLooping = value;
  };


  ///Steuerungsmethoden für den Automaten
  ///// Schaltet die draw-Funtion in Abhängigkeit von IsLooping an oder ab
  this.handleLoopAction = function()
  {
    const boolean = !self._isLooping;
    self.setIsLooping(boolean);
    
    if (self._isLooping) 
    {
      loop();
      console.log("looping");
    }
    else
    {
      noLoop();
    }
  };

  this.renderOneGenerationButtonAction = function()
  {
    self.setIsLooping(false);
    self._automaton.generateGeneration();
  }

  ///Konvertiert eine eingegebene Dezimalzahl in ein Regel-Array
  ///Prüft zuerst, ob die eingegebene Zahl im gültigen Wertebereich zwischen 0 und 255 liegt.
  ///Die eingegebene Zahl wird in einen String umgewandelt, der die Regelnummer als binärzahl enthält.
  ///Die einzelenen Zeichen des Strings werden in umgekehrter Reihenfolge in ein Array sortiert.
  ///Für Werte von decimalNumber < 128 (kleinste achtstellige binärzahl) wird das Array so lange mit 0en 
  ///aufgefüllt, bis die Array-Länge 8 erreicht ist.
  this.convertDecimalRule= function(decimalNumber)
  {
      let ruleString = decimalNumber.toString(2);
      console.log(ruleString);
      let ruleArray = [];
      for (let i = 0; i< ruleString.length; i++)
      {
        ruleArray.unshift(parseInt(ruleString.charAt(i)))
      }
      while (ruleArray.length<8)
      {
        ruleArray.push(0);
      }
      return ruleArray;
  };

  ///wird von von den Regel-Inputs aufgerufen
  ///als Parameter wird die Change-Funktion des jeweiligen Inputs übergeben, die die
  ///neue Regel als Dezimalzahl als Rückgabewert hat.
  this.changeRuleSet = function(newRule)
  {
    noLoop();
    const _newRule = newRule; ///hier checkBoxtoDEcimal einfügen
    this._automaton._ruleset = this.convertDecimalRule(_newRule);
  }

  this.updateRule =function()
  {
    //// hier mit GUI verknüpfen!
  };

  this.reset = function ()
  {
    ////hier alle viewModel-Daten auf 0 setzen
    this._automaton.resetAutomaton();
    this.setIsLooping(false);
  }
  
  //// Methoden zur Berechnung des Layouts
  this.getdisplayPanelSizeX = function()
  {
    let dpsX = width - (this._outputPanelEdgeLeft + this._outputPanelEdgeRight);
    return dpsX;
  };
  
  this.getdisplayPanelSizeY = function()
  {
    let dpsY = height - (this._outputPanelBottom+this._outputPanelTop);
    return dpsY;
  };
  
  /// Programmabhängige Methoden
}

function View(viewmodel) 
{
  let self = this;
  this._vm = viewmodel;
  
  // Observer Pattern Methoden
  this.update = function (data)
  {
    this.render(automaton);
  }

  ///Kommunikation mit viewModel
  ///ruft die mediateIsRendered-Funktion des viewModels auf, die wiederum den übergebenen Wert 
  ///an die isRendered-Variable des Automaten weitergibt
  ///nur wenn isRendered = true wird die nächste generation berechnet.
  this.setIsRendered = function(value)
  {
    const givenValue = value;
    this._isRendered = givenValue;
    this._vm.mediateIsRendered(givenValue);
  }

  this.initialise = function(){
    background(100);
    noStroke();
    fill(0); 
  };

  this.render = function(automaton){
    /////füllen
    this.setIsRendered(true);
    console.log("rendered");
  };
  this.clearAll = function()
  {
    background(100);
    this._vm.reset();
  };
  
  this.resetButtonAction = function()
  {
    self.clearAll();
    console.log("cleared!");
  }
}
///////////////////////////////////////////////ENDE GRAFISCHE AUSGABE//////////////////////////////////////////

////////////////////////////////////////////////////GUI////////////////////////////////////////////////////////
function Gui(viewmodel, view)
{
  ///GUi Allgemein
  this._viewmodel = viewmodel;
  this._view = view;
  this.runPauseButton = createButton("run/pause");
  this.renderOneGenerationButton = createButton("One forward");
  this.resetButton = createButton("reset");

  /////Button Callback-Methoden
  this.runPauseButton.mousePressed (this._viewmodel.handleLoopAction);
  this.resetButton.mousePressed(this._view.resetButtonAction);
  this.renderOneGenerationButton.mousePressed(this._viewmodel.renderOneGenerationButtonAction);

  ///Programmspezifisches GUI


}
