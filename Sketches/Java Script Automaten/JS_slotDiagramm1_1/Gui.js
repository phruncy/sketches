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
  /*const _checkboxPositionY = 50;
  let _checkboxPositionX = 10;
  this._checkBoxesStateArray = [0,0,0,0,0,0,0,0];
  this._checkBoxArray = 
  [
  this.checkbox111 = createCheckbox('111',false),
  this.checkbox110 = createCheckbox('110',false),
  this.checkbox101 = createCheckbox('101',false),
  this.checkbox100 = createCheckbox('100',false),
  this.checkbox011 = createCheckbox('011',false),
  this.checkbox010 = createCheckbox('010',false),
  this.checkbox001 = createCheckbox('001',false),
  this.checkbox000 = createCheckbox('000',false)
  ];*/
  
  ///Callback_methoden
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

  /////Button Callback-Methoden
  this.runPauseButton.mousePressed (this._viewmodel.runPauseButtonAction);
  this.resetButton.mousePressed(this._viewhandler.clearAllViews);
  this.renderOneGenerationButton.mousePressed(this._viewmodel.renderOneGenerationButtonAction);
  this.hideAdditionalView.mousePressed(this._viewhandler.hideAdditionalViewButtonAction);
  this.closeCircleButton.mousePressed(this._viewmodel.closeCircleButtonAction);
  this.textInput.changed(self.textInputChanged);
  


  /*this.setCheckBoxesStateArray = function()
  { 
    for (let i = 0; i<self._checkBoxesStateArray.length; i++)
    {
        self._checkBoxesStateArray[i] = self._checkBoxArray[i].checked()? 1:0;
    }
    console.log(self._checkBoxesStateArray);
  };

    ///wandelt das CheckBoxesState-Array in ein integer um, 
  ///das dann von der convertDecimalRule-Funktion gelesen werden kann.
  this.convertCheckboxToDecimal = function()
  {
    self.setCheckBoxesStateArray();
    let checkBoxString = "";
    self._checkBoxesStateArray.forEach(function(element){checkBoxString += element});
    const checkBoxDecimal = parseInt(checkBoxString,2);
    console.log("dezimal: "+checkBoxDecimal);
    //textInput.value(checkBoxDecimal);
    return checkBoxDecimal;
  };

  /// Jede Änderung an einer beliebigen Box führt zum Aufruf von _checkBoxesStateArray    
  this._checkBoxArray.forEach(function(element)
  {
    let decimal = self.convertCheckboxToDecimal();
    console.log("die dezimale "+decimal);
    console.log(element);
    element.changed(self._viewmodel.changeRuleSet(decimal));
    console.log("bububu");
  });


  this.convertDecimaltoChecks = function(decimal)
  {
    const _decimal = decimal
    const newStateString = _decimal.toString(2);
    console.log(newStateString);
    checkBoxesStateArray.forEach(function(element){element =0});
    for (let i = 0; i<newStateString.length; i++)
    {
       checkBoxesStateArray[i]= parseInt(newStateString.charAt(i));
    }
    console.log(checkBoxesStateArray);
    for (let i = 0; i<checkBoxesStateArray.length; i++)
    {
        if (checkBoxesStateArray[i]==1)
        {
            checkBoxArray[i].checked();
        }
        else {checkBoxArray[i].unchecked();}
    }
  };*/

  ///Programmspezifisches GUI

  this.initialise = function()
  {
    ///Positionierung der Chackboxen
    /*this._checkBoxArray.forEach(function(element)
        {
            element.position(this._checkboxPositionX,this._checkboxPositionY);
            this._checkboxPositionX += 50;
        });
    this.convertDecimaltoChecks(automaton._ruleset); */
  }
}
