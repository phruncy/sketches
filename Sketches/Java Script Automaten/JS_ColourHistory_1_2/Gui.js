function Gui(viewmodel,  viewhandler)
{
  ///GUi Allgemein
  this._viewmodel = viewmodel;
  let self = this;
  this._viewhandler = viewhandler;
  this.runPauseButton = createButton("run/pause");
  this.renderOneGenerationButton = createButton("One forward");
  this.resetButton = createButton("reset");
  this.hideAdditionalView = createButton("Standardansicht an/aus");
  this.closeCircleButton = createButton("cyclic an/aus");
  this.textInput = createInput(automaton._ruleSet);

  ///Callback-Methoden
  this.textInputChanged = function()
  {
    if (self.textInput.value()>255|| self.textInput.value<0 || self.textInput.value == NaN)
    {
        console.log("ungültiger Wert");
    }
    else
    {
        const _newRule = parseInt(this.value());
        console.log("new Rule :"+_newRule);
        //convertDecimaltoChecks(parseInt(_newRule));
        self._viewmodel.changeRuleSet(_newRule);
        return _newRule;
    }
  };


  /////Button Callbacks
  this.runPauseButton.mousePressed (this._viewmodel.runPauseButtonAction);
  this.resetButton.mousePressed(this._viewhandler.clearAllViews);
  this.renderOneGenerationButton.mousePressed(this._viewmodel.renderOneGenerationButtonAction);
  this.hideAdditionalView.mousePressed(this._viewhandler.hideAdditionalViewButtonAction);
  this.closeCircleButton.mousePressed(this._viewmodel.closeCircleButtonAction);
  this.textInput.input(self.textInputChanged);
  ///Programmspezifisches GUI
}
