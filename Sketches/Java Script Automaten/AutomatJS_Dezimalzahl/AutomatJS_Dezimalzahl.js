var automaton;
var viewmodel;
var view ;
var canvas;

function setup() {
canvas = createCanvas(windowWidth,windowHeight);
//canvas.position(100,50);
canvas.class("automaton");
background(255);
frameRate(2);
noLoop();

///Object instanciation
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
view = new View(viewmodel);

//Object Initialsisierung
viewmodel.setCellNumber();
automaton.initialise();
viewmodel.changeRuleSet(150);
view.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
viewmodel.subscribe(view);
}

function draw() 
{ 
    automaton.generateGeneration();      
}

function mousePressed()
{
  loop();
}

function mouseReleased()
{
  noLoop();
}

function windowResized()
{
  resizeCanvas(windowWidth,windowHeight);
}

/// Automaton class
function Automaton() {
  let self = this;
  this._generationCount = 0;
  this._cells = [];
  this._ruleset = [];
  this.isCyclic = false;

  this.observers = [];
  
  //Getter/Setter
  this.setIsCyclic = function(value){
    this._isCyclic = value;
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
  this.initialise = function(){
    this._ruleSet = [0,0,0,0,0,0,0,0];
    console.log (this._cellCount);
    for (let i = 0; i<this._cellCount; i++)
    {
      this._cells.push(new Cell(0, this));
      this._cells[i].setPosition(i);
      if (i>1 && i<this._cellCount)
      {
        this.setNeighbours(this._cells[i-1]);
      }
    }
    console.log(this._cells);
    this.disconnectRingGrid();
    this.initialiseState();
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
  
  this.disconnectRingGrid = function()
  {
    this._cells[0].setLeftNeighbour(null);
    this._cells[0].setRightNeighbour(null);
    this._cells[this._cells.length-1].setLeftNeighbour(null);
    this._cells[this._cells.length-1].setRightNeighbour(null);
  };
  
  this.resetAutomaton = function(){
    for(let i=0; i<_this.cells.length; i++){
      this._cells[i].reset();
    }
    this._generationCount = 0;
  };
  
  this.generateGeneration = function(){
    for(let i =0; i<this._cells.length; i++)
    {
      if(this._cells[i].leftNeighbour != null){
        this._cells[i].generateCellParameters();
      }
    }
    this._generationCount++;
    this.notifyObservers();
  };
}

///Cell Class
function Cell(initialState, automaton) {
  this._automaton = automaton;
  this._state = initialState;
  this._formerState = 0;
  this._age = 0;
  this._position = undefined;
  this.leftNeighbour = undefined;
  this.rightNeighbour = undefined;
  
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
  };
  
  this.setAge = function(){
    this._age = ((this._state==1)&&(this._formerState==1))? this._age++ : 0;
  };
  
  this.reset = function(){
    this._state = 0;
    this._age = 0;
    this._formerState = 0;
  };  
}

function ViewModel(automato) 
{
  let self = this;
  this._automaton = automato;
  this._isRunable = true;
  this.observers = [];
  
  this._outputPanelTop = 100;
  this._outputPanelBottom =50;
  this._outputPanelEdgeLeft = 50;
  this._outputPanelEdgeRight =50;
  
  //Programmabhängige Globale Variablen 
  this._cellStateDecimal = 0;
  
  
  //Observer Pattern Methoden
  this.update = function(data)
  {
    this._cellStateDecimal = this.calculateDecimalNumber();
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
  this.setIsRunable = function(value)
  {
    this._isRunable = value;
  }
  
  ///Einstellbar machen
  this.setCellNumber= function(){
    const cellNum = 24;
    this._automaton._cellCount = cellNum;
  };
  
  ///Konvertiert eine eingegebene Dezimalzahl in ein Regel-Array
  ///Prüft zuerst, ob die eingegebene Zahl im gültigen Wertebereich zwischen 0 und 255 liegt.
  ///Die eingegebene Zahl wird in einen String umgewandelt, der die Regelnummer als binärzahl enthält.
  ///Die einzelenen Zeichen des Strings werden in umgekehrter Reihenfolge in ein Array sortiert.
  ///Für Werte von decimalNumber < 128 (kleinste achtstellige binärzahl) wird das Array so lange mit 0en 
  ///aufgefüllt, bis die Array-Länge 8 erreicht ist.
  this.convertDecimalRule= function(decimalNumber){
    if (decimalNumber<0 || decimalNumber >255){
      console.log("ungültiger Wert");
    }
    else {
      let ruleString = decimalNumber.toString(2);
      let ruleArray = [];
      for (var i = 0; i< ruleString.length; i++)
      {
        ruleArray.unshift(parseInt(ruleString.charAt(i)))
      }
      while (ruleArray.length<8)
      {
        ruleArray.push(0);
      }
      return ruleArray;
    }
  };

  this.changeRuleSet = function(number)
  {
    this._automaton._ruleset = this.convertDecimalRule(number);
  }

  this.updateRule =function()
  {
    //// hier mit GUI verknüpfen!
  };

  this.reset = function ()
  {
    ////hier alle viewModel-DAten auf 0 setzen
    this._automaton.resetAutomaton();
  }
  
  this.getdisplayPanelSizeX = function(){
    let dpsX = width - (this._outputPanelEdgeLeft + this._outputPanelEdgeRight);
    return dpsX;
  };
  
  this.getdisplayPanelSizeY = function(){
    let dpsY = height - (this._outputPanelBottom+this._outputPanelTop);
    return dpsY;
  };
   
  /// Programmabhängige Methoden

  ///Wandelt den Zustand aller Zellen in eine Dezimalzahl um 
  this.calculateDecimalNumber = function ()
  {
    let cellStateString = "";
    this._automaton._cells.forEach(function (index){cellStateString = cellStateString + index._state});
    console.log(cellStateString);
    let cellStateDecimal = parseInt(cellStateString, 2);
    console.log (cellStateDecimal);
    return cellStateDecimal; 
  }
}

function View(viewmodel) {
  this._vm = viewmodel;
  this._isRendered = true;
  this._displayedDecimalNumber = "";
  this._textSize = 300;
  
  // Observer Pattern Methoden
  this.update = function (data)
  {
    this.render(automaton);
  }

  this.initialise = function(){
    background(100);
    noStroke();
    fill(0); 
  };

  this.setDisplayedDecimalNumber = function()
  {
    this._displayedDecimalNumber = ""+ this._vm._cellStateDecimal;
  }

  this.render = function(automaton){
    /////füllen
    background(255);
    this.setDisplayedDecimalNumber();
    textSize(this._textSize);
    fill(0);
    text(this._displayedDecimalNumber,20,windowHeight/2);
    this._vm.setIsRunable(true);
    textSize(32);

  };
  this.clearAll = function()
  {
    background(255);
    this._vm.reset();
  };
  
}

function Gui(automaton, viewmodel, view) {}
