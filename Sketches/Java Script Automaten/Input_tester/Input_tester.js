///Checkboxen
var checkbox111;
var checkbox110;
var checkbox101;
var checkbox100;
var checkbox011;
var checkbox010;
var checkbox001;
var checkbox000;
var checkBoxesStateArray;
var checkBoxArray;

///Slider
var ruleSlider;

///textfeld
var textInput;

function setup() 
    {
    ////////////Checkboxen  
    const checkboxPositionY = 50;
    let checkboxPositionX = 10;
    checkBoxesStateArray = [0,0,0,0,0,0,0,0];
    checkBoxArray = 
    [
    checkbox111 = createCheckbox('111',false),
    checkbox110 = createCheckbox('110',false),
    checkbox101 = createCheckbox('101',false),
    checkbox100 = createCheckbox('100',false),
    checkbox011 = createCheckbox('011',false),
    checkbox010 = createCheckbox('010',false),
    checkbox001 = createCheckbox('001',false),
    checkbox000 = createCheckbox('000',false)
    ];

    checkBoxArray.forEach(function(element)
        {
            element.position(checkboxPositionX,checkboxPositionY);
            checkboxPositionX += 50;
        });
    /// Jede Änderung an einer beliebigen Box führt zum Aufruf von checkBoxesStateArray    
    checkBoxArray.forEach(function(element)
        {
            element.changed(convertCheckboxToDecimal);
        });  
        
    //////////////Slider
    ruleSlider = createSlider(0,255,110, 1);
    ruleSlider.position(20, 150);

    ///////////////Textfeld
    textInput = createInput(0);
    textInput.position(20, 200);
    textInput.input(textInputChanged);
    
}

function draw() 
{
  
}

function setCheckBoxesStateArray()
{
    for (let i = 0; i<checkBoxesStateArray.length; i++)
    {
        checkBoxesStateArray[i] = checkBoxArray[i].checked()? 1:0;
    }
}

///wandelt das CheackBoxesState-Array in ein integer um, das dann von der convertDecimalRule-Funktion gelesen werden kann.
function convertCheckboxToDecimal ()
{
    setCheckBoxesStateArray();
    let checkBoxString = "";
    checkBoxesStateArray.forEach(function(element){checkBoxString += element});
    const checkBoxDecimal = parseInt(checkBoxString,2);
    console.log("dezimal: "+checkBoxDecimal);
    textInput.value(checkBoxDecimal);
    return checkBoxDecimal;
} 

function convertDecimaltoChecks(decimal)
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
}

function textInputChanged()
{
    if (this.value()>255|| this.value<0 || this.value == NaN)
    {
        console.log("ungültiger Wert");
    }
    else
    {
        const _newRule = this.value();
        console.log(_newRule);
        //convertDecimaltoChecks(parseInt(_newRule));
        return _newRule;
    }

}