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
          this._buffer.rect(this._vm.getCellPositionX(i), this._vm.getCellPositionY(), this._vm._cellWidth, this._vm._cellWidth)
        }
      }
    }  
    this.setIsRendered(true);
    console.log("rendered");
  };

  this.clearAll = function()
  {
    this._buffer.clear();
    this._buffer.background(200);
    this._vm.reset();
  };
}
