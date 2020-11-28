function ViewModel(automato) 
{
  ////////////////////////////////////////NICHT ÄNDERN/////////////////////////////////////////

  let self = this; ///kann benutzt werden, wenn die Bezeichnung "this" missverständlich ist
  this._automaton = automato;
  this._isLooping = false;
  this.observers = [];

  this._cellWidth = 5;///Startwert

  this._bufferGap = width*0.05;
  this._bufferWidth = 24*this._cellWidth;
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
    this.setCellWidth(5);
    this.setBufferWidth(this.getBufferWidth());
    this.setAdditionalViewPosition();
  };
  
  //////vermittelt den Wert von view._isRendered zwischen view und Automatenlogik
  this.mediateIsRendered = function (value)
  {
    const givenValue = value;
    this._automaton.setIsViewModelReady(givenValue);
  };

  this.setIsLooping = function(value)
  {
    this._isLooping = value;
  };
  
    this.reset = function ()
  {
    ////hier alle viewModel-Daten auf 0 setzen
    this._automaton.resetAutomaton();
    this.setIsLooping(false);
  };


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
    if (self._automaton._isCyclic == false)
    {      
      self._automaton.setIsCyclic(true);
      self._automaton.closeRingGrid(); 
    }
    else
    {
      self._automaton.disconnectRingGrid();
      self._automaton.setIsCyclic(false);
    }         
  }
  
  /// Methoden zur Änderung der Automatenregel
  
  /*Konvertiert eine eingegebene Dezimalzahl in ein Regel-Array
    Prüft zuerst, ob die eingegebene Zahl im gültigen Wertebereich zwischen 0 und 255 liegt.
    Die eingegebene Zahl wird in einen String umgewandelt, der die Regelnummer als binärzahl enthält.
    Die einzelenen Zeichen des Strings werden in umgekehrter Reihenfolge in ein Array sortiert.
    Für Werte von decimalNumber < 128 (kleinste achtstellige binärzahl) wird das Array so lange mit 0en 
    aufgefüllt, bis die Array-Länge 8 erreicht ist.*/
  this.convertDecimalRule= function(decimalNumber)
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
  
  ////Methoden der Standard-Visualisierung
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
  
  this.setCellWidth = function(value)
  {
    this._cellWidth = value;
  };

  this.getBufferWidth = function()
  {
    this._bufferWidth = 24*this._cellWidth;
    console.log(this._bufferWidth+ "bufferwidth called");
    return this._bufferWidth;
  };

  this.setBufferWidth  = function(value)
  {
    this._bufferWidth =value;
  }

  this.setAdditionalViewPosition = function()
  {
    this._additionalViewPosition = this._bufferWidth + this._bufferGap;
  };  

  this.getCanvasWidth = function ()
  {
    let newBufferWidth = this.getBufferWidth();
    let newWidth = 2*this.newBufferWidth + 0.1*this.newBufferWidth;
    return newWidth;
  };

  this.calculateR = function()
  {
    let rString = "";
    for (let i = 0; i<8; i++)
    {
      rString = rString+ this._automaton._cells[i]._state;
    }
    let rValue = parseInt(rString,2);
    return rValue;
  };
  
  this.calculateG = function()
  {
    let gString = "";
    for (let i = 8; i<16; i++)
    {
      gString = gString+ this._automaton._cells[i]._state;
    }
    let gValue = parseInt(gString,2);
    return gValue;
  };
  
  this.calculateB = function()
  {
    let bString = "";
    for (let i = 16; i<this._automaton._cells.length; i++)
    {
      bString = bString+ this._automaton._cells[i]._state;
    }
    let bValue = parseInt(bString,2);
    return bValue;
  };

}
