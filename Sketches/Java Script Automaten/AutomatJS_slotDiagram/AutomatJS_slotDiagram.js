

var automaton;
var viewmodel;
var view ;
var canvas;

function setup() 
{
noLoop();
frameRate(1);
canvas = createCanvas(windowWidth,windowHeight);
canvas.class("automaton")

///Object instanciation
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
view = new View(viewmodel);


//Object Initialsisierung
automaton.initialise(viewmodel.convertDecimalRule(150), viewmodel.setCellNumber());
viewmodel.initialise();
view.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
viewmodel.subscribe(view);
}

function draw() 
{ 
      automaton.generateGeneration();viewmodel.setRunable(false);
}

///vorläufig!
function mousePressed()
{
    loop();
}

function mouseReleased()
{
    noLoop();
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
  this.initialise = function(rule, cellNumber){
    for (let i = 0; i<this._cellCount; i++)
    {
      this._ruleset = rule;
      this,_cellNumber = cellNumber;
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

function ViewModel(automato) 
{
  let self = this;
  this._automaton = automato;
  
  this._slotWidth = 50;////!
  this._backgroundcolor = color(51, 102, 204);
  this._cellHistoryStackArray = [];
  
  this._numOfObjectsToUpdate = 0;
  this.observers = [];
  this._isRunable = true;
  
  this._edge = 0;
  this._horizontalSpacing = 0;
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
    this.initialiseCellStackArray();
    console.log("ready");
  }

  this.setRunable = function(value)
  {
    this._isRunable = value;
  }

  this.setCellNumber= function(){
    let cellNum = (this.getdisplayPanelSizeX()- 2*this._edge)/this._slotWidth;
    let intCellNum = parseInt(cellNum);
    this._automaton._cellCount = intCellNum;
    this._numOfObjectsToUpdate = intCellNum;
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
    this.resetCellStackArray();
  }
  
  this.getdisplayPanelSizeX = function(){
    let dpsX = width - (this._outputPanelEdgeLeft + this._outputPanelEdgeRight);
    return dpsX;
  };
  
  this.getdisplayPanelSizeY = function(){
    let dpsY = height - (this._outputPanelBottom+this._outputPanelTop);
    return dpsY;
  };
  
  // Programmabhängige Methoden
  //// berechnet die Position der einzelnen Balkenelemente 
  this.getBarPosition = function(cellPosition)
  {
      let barPosition = (cellPosition* (this._slotWidth+this._horizontalSpacing)) + this._outputPanelEdgeLeft;
      return barPosition;
  }

  ////Bestimmt über das History-Array, wie oft eine einzelne Zelle in der Laufzeit des Automaten den Wert 1 hatte 
  this.getActiveCellHistoryNumber = function(index)
  {
      let numberOfActiveCells = 0;
      this._automaton._cells[index]._history.forEach(function(element){if (element == 1)numberOfActiveCells++});
      console.log("noac: "+ numberOfActiveCells);
      return numberOfActiveCells;
  }

  //erstellt ein CellHistoryStackArray mit der gleichen Anzahl an Elementen wie automaton._cells
  this.initialiseCellStackArray = function ()
  {
    for (let i =0; i< this._numOfObjectsToUpdate; i++)
    {
        let positionX = this.getBarPosition(i);
        this._cellHistoryStackArray.push(new CellHistoryStack(positionX,0, this));
    }
  }

  this.resetCellStackArray = function()
  {
     this._cellHistoryStackArray = [];   
  }
}

function View(viewmodel) {
  this._vm = viewmodel;
  this._isRendered = true;
  
  // Observer Pattern Methoden
  this.update = function (data)
  {
    this.render(automaton);
  }

  this.initialise = function()
  {
    fill(255);
    background(this._vm._backgroundcolor);
    stroke(this._vm._backgroundcolor); 
  };

  this.render = function(automaton)
  {
    for (let i = 0; i<this._vm._numOfObjectsToUpdate; i++)
    {
        let parameter = this._vm.getActiveCellHistoryNumber(i);
        console.log("a"+parameter);
        this._vm._cellHistoryStackArray[i].setStackSize(parameter);
        console.log("b "+this._vm._cellHistoryStackArray[i]._stackSize);
        this._vm._cellHistoryStackArray[i].display();
    }
  };

  this.clearAll = function()
  {
    background(100);
    this._vm.reset();
  };
  
}

function CellHistoryStack (positionX, initialHeight, myViewModel)
{
    this._viewModel = myViewModel;
    this._xScale = this._viewModel._slotWidth;
    this._position = positionX;
    this._stackSize = 0;

    ///Methoden

    this.setStackSize = function (value)
    {
        this._stackSize= value;
    }

    this.display = function()
    {
        let singleBlockPositionY = height - this._xScale;
        let i = 0;
        fill(255);
        while (i< this._stackSize )
        {
            console.log("while aktiv");
            rect(this._position,singleBlockPositionY,this._xScale, this._xScale);
            singleBlockPositionY -= this._xScale;
            i++;
        }
    }
}
