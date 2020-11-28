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
  };

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
  };
}
