function ViewModel(automato) 
{
  let self = this; ///kann benutzt werden, wenn die Bezeichnung "this" missverständlich ist
  this._automaton = automato;
  this._cellSize = 0;
  this._horizontalSpacing = 0;
  this._edge = 0;
  this._isLooping = false;
  this.observers = [];
  
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
  
  /// Programmabhängige Methoden
}
