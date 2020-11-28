/*
  Neuerungen in 1.3:
  _Die Standardvisualisierung kann jetzt zugeschalten werden
  _Zellularraum kann ringförmig geschlossen werden 
  _die berechnung vieler Positionen rechtet sich nach der Größe der einzelnen Ansichten,
    nicht mehr nach der Größe der canvas
  
  Neuerungen in 1.5:
  _Aufteilung des Skripts in mehrere Dokumente zur besseren Übersicht
  _bessere Kommentare
*/

var automaton;
var viewmodel;
var mainView;
var additionalView;
var viewHandler;
var gui;
var leftCanvas;
var rightCanvas;

function setup() {
frameRate(10);  
createCanvas(1000,500);
clear();
/*leftCanvas = createGraphics(width/2, height);
leftCanvas.addClass("canvas");
rightCanvas = createGraphics(width/2, height);
rightCanvas.addClass("canvas");*/

///Object instanciation
/// Die Klassen müssen von "unten" (Model) nach oben (Gui) instanziiert werden
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
leftCanvas = createGraphics(viewmodel._bufferWidth, height);
rightCanvas = createGraphics(viewmodel._bufferWidth, height);
mainView = new View(viewmodel, leftCanvas);
additionalView = new DefaultView(viewmodel, rightCanvas);
viewHandler = new ViewHandler(mainView, additionalView);
gui = new Gui(viewmodel, viewHandler);

//Object Initialsisierung
automaton.initialise(viewmodel.convertDecimalRule(110), 100);
viewmodel.initialise();
additionalView.initialise();
mainView.initialise();
gui.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
viewmodel.subscribe(mainView);
viewmodel.subscribe(additionalView);

noLoop(); //Draw soll erst durch Klicken auf den Run-Button ausgeführt werden
}
////////////////////////Setup Ende///////////////////////////////////////////////////////////////


function draw() 
{     
  automaton.generateGeneration();
}

function windowResized()
{
  resizeCanvas(windowWidth,windowHeight);
}
