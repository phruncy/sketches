function ViewModel(automato) 
{
  ////////////////////////////////////////NICHT ÄNDERN/////////////////////////////////////////
  let self = this; ///kann benutzt werden, wenn die Bezeichnung "this" missverständlich ist
  this._automaton = automato;
  this._isLooping = false;
  this.observers = [];

  this._cellWidth = 0;
  this._edge = 0;
  this._backgroundcolor = color(51, 102, 204);
  this._cellHistoryStackArray = [];
  
  this._numOfObjectsToUpdate = 0;

  this._bufferGap = width*0.05;
  this._bufferWidth = (width/2) - this._bufferGap;
  this._additionalViewPosition = this._bufferWidth + this._bufferGap;

  
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
    this._numOfObjectsToUpdate = this._automaton._cellCount;
    this.calculateCellSize();
    this.initialiseCellStackArray();
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
  
    this.reset = function ()
  {
    ////hier alle viewModel-Daten auf 0 setzen
    this._automaton.resetAutomaton();
    this.resetCellStackArray();
    this.setIsLooping(false);
  }


  ///gui-Input Callback Methoden
  
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
  
  ///berechnet und rendert eine einzelne Generation
  this.renderOneGenerationButtonAction = function()
  {
    self.setIsLooping(false);
    self._automaton.generateGeneration();  
  }

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
  
  /// Methoden zur Änderung der Automatenregel
  
  /*Konvertiert eine eingegebene Dezimalzahl in ein Regel-Array
    Prüft zuerst, ob die eingegebene Zahl im gültigen Wertebereich zwischen 0 und 255 liegt.
    Die eingegebene Zahl wird in einen String umgewandelt, der die Regelnummer als binärzahl enthält.
    Die einzelenen Zeichen des Strings werden in umgekehrter Reihenfolge in ein Array sortiert.
    Für Werte von decimalNumber < 128 (kleinste achtstellige binärzahl) wird das Array so lange mit 0en 
    aufgefüllt, bis die Array-Länge 8 erreicht ist.*/
  self.convertDecimalRule= function(decimalNumber)
  {
      let ruleString = decimalNumber.toString(2);
      let ruleArray = [];
      for (let i = 0; i< ruleString.length; i++)
      {
        ruleArray.unshift(parseInt(ruleString.charAt(i)))
      }
      while (ruleArray.length<8)
      {
        ruleArray.push(0);
      }
      console.log("yeay");
      return ruleArray;
  };

  ///wird von von den Regel-Inputs aufgerufen
  ///als Parameter wird die Change-Funktion des jeweiligen Inputs übergeben, die die
  ///neue Regel als Dezimalzahl als Rückgabewert hat.
  self.changeRuleSet = function(newRule)
  {
    noLoop();
    const _newRule = newRule; ///hier checkBoxtoDEcimal einfügen
    self._automaton._ruleset = self.convertDecimalRule(_newRule);
    console.log("changed");
    console.log(self._automaton._ruleset);
  }
  
  ////////////////////////Methoden der Standard-Visualisierung//////////////////////////////////
  this.calculateCellSize = function ()
  {
    this._cellWidth = this._bufferWidth/ this._automaton._cellCount;
  }

  this.getCellPositionX = function(indexOfCell)
  {
    let posX = indexOfCell * this._cellWidth;
    return posX;
  };
  
  this.getCellPositionY = function(){
    let posY = 0;
    posY = (this._automaton._generationCount)* this._cellWidth;
    return posY;
  };
  ////////////////////////////Programmabhängige Methoden für Custom View hier einfügen//////////

  //// berechnet die Position der einzelnen Balkenelemente 
  this.getBarPosition = function(cellPosition)
  {
      let barPosition = cellPosition*this._cellWidth;
      return barPosition;
  }

  ////Bestimmt über das History-Array, wie oft eine einzelne Zelle in der Laufzeit des Automaten den Wert 1 hatte 
  this.getActiveCellHistoryNumber = function(index)
  {
      let numberOfActiveCells = 0;
      this._automaton._cells[index]._history.forEach(function(element){if (element == 1)numberOfActiveCells++});
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
  };

  this.resetCellStackArray = function()
  {
     this._cellHistoryStackArray.forEach(function(element){element.setStackSize(0)});  
  };

}


