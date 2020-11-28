///////////////////////////////// NICHT ÄNDERN ////////////////////////////////////////////
///Standard-Vidualisierung des Automaten
///Kann bei Bedarf dazugeschalten oder ausgeblendet werden

function DefaultView(viewModel, buffer)
{
  this._vm = viewModel;
  this._buffer = buffer;
  this._bufferIsDisplayed = true;

  this.setBufferIsDisplayed = function(value)
  {
    this._bufferIsDisplayed = value;
  }

  this.initialise = function()
  {
    this._buffer.background(100);
  };

  this.update = function (data)
  {
    this.render(automaton);
    if(this._bufferIsDisplayed==true)
    {
      image(this._buffer, this._vm._additionalViewPosition, 0);
      console.log(this._vm._bufferWidth);
    }
  };

  this.render = function(automaton)
  {
    for(let i =0; i<automaton._cells.length; i++)
    {      
      if(automaton._cells[i]._state ==1)
      {
        this._buffer.fill(0);
        this._buffer.rect(this._vm.getCellPositionX(i), this._vm.getCellPositionY(), this._vm._cellWidth, this._vm._cellWidth);
      }
    }
  };
  this.clearAll = function()
  {
    this._buffer.fill(100);
    this._buffer.clear();
    this._buffer.background(100);
    //console.log("default view cleared");
    redraw();
  };
}
