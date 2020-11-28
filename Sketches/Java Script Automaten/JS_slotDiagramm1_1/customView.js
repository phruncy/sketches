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

  this.render = function(automaton)
  {
    for (let i = 0; i<this._vm._numOfObjectsToUpdate; i++)
    {
        let parameter = this._vm.getActiveCellHistoryNumber(i);
        this._vm._cellHistoryStackArray[i].setStackSize(parameter);
        this._vm._cellHistoryStackArray[i].display();
    }  
    this.setIsRendered(true);
  };

  this.clearAll = function()
  {
    this._buffer.clear();
    this._buffer.background(200);
    this._vm.reset();
  };
}

////Container-Objekt für die information über einen Balken an einer Zellposition
function CellHistoryStack (positionX, initialHeight, myViewModel)
{
    this._viewModel = myViewModel;
    this._xScale = this._viewModel._cellWidth;
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
            mainView._buffer.rect(this._position,singleBlockPositionY,this._xScale, this._xScale);
            singleBlockPositionY -= this._xScale;
            i++;
        }
    }

}
