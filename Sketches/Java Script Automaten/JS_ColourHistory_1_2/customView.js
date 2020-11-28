/*
  In dieser Darstellungsform wird der Zustand jeder der 24 Zellen des AUtomaten als eine Stelle eines 24-bit RGB Farbwerts
  interpretiert. Dieser wird als Farbstreifen ausgegeben. Die Höhe der Zellen in der zuschaltbaren Standarddarstellung orientiert
  sich an der einstellbaren höhe der Farbstreifen.
 */ 

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
    {
      let r = this._vm.calculateR();
      let g = this._vm.calculateG();
      let b = this._vm.calculateB();
      noStroke();
      this._buffer.fill(r,g,b);
      this._buffer.rect(0, this._vm.getCellPositionY(), this._vm._bufferWidth, this._vm._cellWidth);
      this.setIsRendered(true);
     };
  };

  this.clearAll = function()
  {
    this._buffer.clear();
    this._buffer.background(200);
    this._vm.reset();
  };
}
