/*
  Neuerungen in 1.3:
  _Die Standardvisualisierung kann jetzt zugeschalten werden
  _Zellularraum kann ringförmig geschlossen werden 
*/
var automaton;
var viewmodel;
var view;
var defaultView;
var viewHandler;
var gui;
var leftCanvas;
var rightCanvas;

function setup() {
createCanvas(1000,500);
background(255);
leftCanvas = createGraphics(width/2, height);
leftCanvas.addClass("canvas");
rightCanvas = createGraphics(width/2, height);
rightCanvas.addClass("canvas");

///Object instanciation
/// Die Klassen müssen von "unten" (Model) nach oben (Gui) instanziiert werden
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
view = new View(viewmodel, leftCanvas);
defaultView = new DefaultView(viewmodel, rightCanvas);
viewHandler = new ViewHandler(view, defaultView);
gui = new Gui(viewmodel, view, defaultView, viewHandler);

//Object Initialsisierung
automaton.initialise(viewmodel.convertDecimalRule(110), 100);
viewmodel.initialise();
defaultView.initialise();
view.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
viewmodel.subscribe(view);
viewmodel.subscribe(defaultView);

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
/// Das Automaten-Objekt existiert nur einmal und dient als Steuerungs- und Containerobjekt für die AUtomatenzellen.
/// Der Zellularraum wird durch ein eindimensionales Array simuliert, dass die Zellobjekte enthält. Der zellularraum kann
/// dabei zyklisch oder oder durch nachbarlose "tote" Zellen am Anfang und Ende des Arrays begrenzt sein.

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

  this.setCellNumber = function (value)
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

  /// 
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
  this._isLooping = false;
  this.observers = [];

  this._cellSize = 0;
  this._edge = 0;

  
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
    this.calculateCellSize();
  }
  
  //////vermittelt den Wert von view._isRendered zwischen view und Automatenlogik
  this.mediateIsRendered = function (value)
  {
    const givenValue = value;
    this._automaton.setIsViewModelReady(givenValue);
  }

  this.setIsLooping = function(value)
  {
    this._isLooping = value;
  };


  ///Steuerungsmethoden für den Automaten
  ////// Schaltet die draw-Funtion in Abhängigkeit von IsLooping an oder ab
  this.runPauseButtonAction = function()
  {
    const boolean = !self._isLooping;
    self.setIsLooping(boolean);
    
    if (self._isLooping) 
    {
      loop();
    }
    else
    {
      noLoop();
    }
  };

  this.renderOneGenerationButtonAction = function()
  {
    self.setIsLooping(false);
    self._automaton.generateGeneration();  }

  this.closeCircleButtonAction = function ()
  {
    noLoop();
    self.setIsLooping(false);
    console.log(self._automaton._isCyclic);
    if (self._automaton._isCyclic == false)
    {      
      console.log("hallo");
      self._automaton.setIsCyclic(true);
      self._automaton.closeRingGrid(); 
      console.log("is Cyclic");
    }
    else
    {
      self._automaton.disconnectRingGrid();
      self._automaton.setIsCyclic(false);
      console.log("isNotCyclic");
    }

         
  }

  /*Konvertiert eine eingegebene Dezimalzahl in ein Regel-Array
    Prüft zuerst, ob die eingegebene Zahl im gültigen Wertebereich zwischen 0 und 255 liegt.
    Die eingegebene Zahl wird in einen String umgewandelt, der die Regelnummer als binärzahl enthält.
    Die einzelenen Zeichen des Strings werden in umgekehrter Reihenfolge in ein Array sortiert.
    Für Werte von decimalNumber < 128 (kleinste achtstellige binärzahl) wird das Array so lange mit 0en 
    aufgefüllt, bis die Array-Länge 8 erreicht ist.*/
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
  
  ////Methoden der Standard Visualisierung
  this.calculateCellSize = function ()
  {
    this._cellSize = (width/2)/ this._automaton._cellCount;
  }

  this.getCellPositionX = function(indexOfCell)
  {
    let posX = indexOfCell * this._cellSize;
    return posX;
  };
  
  this.getCellPositionY = function(){
    let posY = 0;
    posY = (this._automaton._generationCount)* this._cellSize;
    return posY;
  };
  
  /// Programmabhängige Methoden
}

function View(viewmodel, buffer) 
{
  let self = this;
  this._vm = viewmodel;
  this._buffer = buffer;
  
  // Observer Pattern Methoden
  this.update = function (data)
  {
    this.render(automaton);
    image(this._buffer,0,0);
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
    this._buffer.background(200);
    this._buffer.noStroke();
  };

  this.render = function(automaton){
    /////füllen
    {
      for(let i =0; i<automaton._cells.length; i++)
      {      
        if(automaton._cells[i]._state ==1)
        {
          this._buffer.fill(0);
          this._buffer.rect(this._vm.getCellPositionX(i), this._vm.getCellPositionY(), this._vm._cellSize, this._vm._cellSize)
        }
      }
    }  
    this.setIsRendered(true);
    console.log("rendered");
  };

  this.clearAll = function()
  {
    this._buffer.background(255);
    this._vm.reset();
  };
}

//////////Standard-Vidualisierung des Automaten
function DefaultView(viewModel, buffer)
{
  this._vm = viewModel;
  this._buffer = buffer;
  this._bufferisDisplayed = true;

  this.initialise = function()
  {
    console.log(this._buffer);
    this._buffer.background(100);
  };

  this.update = function (data)
  {
    this.render(automaton);
    image(this._buffer, width/2, 0);
    console.log("rendered, too");
  };

  this.render = function(automaton)
  {
    for(let i =0; i<automaton._cells.length; i++)
    {      
      if(automaton._cells[i]._state ==1)
      {
        this._buffer.fill(0);
        this._buffer.rect(this._vm.getCellPositionX(i), this._vm.getCellPositionY(), this._vm._cellSize, this._vm._cellSize)
      }
    }
  };  

  this.clearAll = function()
  {
    this._buffer.fill(100);
    this._buffer.rect(0,0,width/2,height);
    console.log("default view cleared");
    redraw();
    console.log("redrawn");
  };

  this.hideDefaultButtonAction = function(data)
  {
     if(this._bufferisDisplayed == true)
     {
       this._bufferisDisplayed = false;
       this._buffer.hide(); 
     }
     else 
     {
       this._bufferisDisplayed = true;
     }
  };
}

function ViewHandler(view01, view02)
{
  var self = this;
  this._view01 = view01;
  this._view02 = view02;
  this._views = [this._view01, this._view02];

  this.clearAllViews = function()
  {
    console.log(self._views);
    self._views.forEach(function(element){element.clearAll()});
  }
}

///////////////////////////////////////////////ENDE GRAFISCHE AUSGABE//////////////////////////////////////////

////////////////////////////////////////////////////GUI////////////////////////////////////////////////////////
function Gui(viewmodel, view01, view02, viewhandler)
{
  ///GUi Allgemein
  this._viewmodel = viewmodel;
  this._view01 = view01;
  this._view02 = view02;
  this._viewhandler = viewhandler;
  this.runPauseButton = createButton("run/pause");
  this.renderOneGenerationButton = createButton("One forward");
  this.resetButton = createButton("reset");
  this.hideDefaultButton = createButton("hide default button");
  this.closeCircleButton = createButton("cyclic an/aus");


  /////Button Callback-Methoden
  this.runPauseButton.mousePressed (this._viewmodel.runPauseButtonAction);
  this.resetButton.mousePressed(this._viewhandler.clearAllViews);
  this.renderOneGenerationButton.mousePressed(this._viewmodel.renderOneGenerationButtonAction);
  this.hideDefaultButton.mousePressed(this._view02.hideDefaultButtonAction);
  this.closeCircleButton.mousePressed(this._viewmodel.closeCircleButtonAction);
  ///Programmspezifisches GUI
}