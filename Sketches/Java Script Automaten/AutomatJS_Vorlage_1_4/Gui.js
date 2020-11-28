function Gui(viewmodel, view)
{
  ///GUi Allgemein
  this._viewmodel = viewmodel;
  this._view = view;
  this.runPauseButton = createButton("run/pause");
  this.renderOneGenerationButton = createButton("One forward");
  this.resetButton = createButton("reset");

  /////Button Callback-Methoden
  this.runPauseButton.mousePressed (this._viewmodel.handleLoopAction);
  this.resetButton.mousePressed(this._view.resetButtonAction);
  this.renderOneGenerationButton.mousePressed(this._viewmodel.renderOneGenerationButtonAction);

  ///Programmspezifisches GUI
}
