function ViewHandler(view01, view02)
{
  var self = this;
  this._mainView = view01;
  this._additionalView = view02;
  this._views = [this._mainView, this._additionalView];

  this.clearAllViews = function()
  {
    console.log(self._views);
    self._views.forEach(function(element){element.clearAll()});
  }

  /*
    blendet die Standardansicht des Automaten ein oder aus
    Wird BufferIsDisplayed auf 'false' gesetzt, wird der Buffer im nächsten Loop
    nicht mehr aktualisiert. 'clear()' löscht den Inhalt der Canvas; setIsRendered(false)
    bewirkt, dass beim nachfolgendne Aufruf von 'redraw()' der aktuelle Zustand des Automaten 
    gerendert wird. 
    Wird BufferIsDisplayed auf 'true' gesetzt, wird der Buffer im nächsten Loop wieder auf
    der Canvas abgebildet. 
  */
  this.hideAdditionalViewButtonAction = function(data)
  {
    if (self._additionalView._bufferIsDisplayed == true)
    {
      self._additionalView.setBufferIsDisplayed(false);
      self._mainView.setIsRendered(false);
      clear();
      redraw();
    }
    else
    {
      self._additionalView.setBufferIsDisplayed(true);
      self._mainView.setIsRendered(false);
      redraw();
    }
  };
}
