/*
  Neuerungen in 1.3:
  _Die Standardvisualisierung kann jetzt zugeschalten werden
  _Zellularraum kann ringförmig geschlossen werden 
  _die berechnung vieler Positionen rechtet sich nach der Größe der einzelnen Ansichten,
    nicht mehr nach der Größe der canvas
  
  Neuerungen in 1.5:
  _Aufteilung des Skripts in mehrere Dokumente zur besseren Übersicht
  _bessere Kommentare

  Neuerungen 1.6:
  _Es wird nun eine zufällige Regel als Startregel festgelegt
*/
'use strict';

var automaton;
var viewmodel;
var mainView;
var additionalView;
var viewHandler;
var gui;
var canvas;
var leftCanvas;
var rightCanvas;
var outsideCanvasView;
var outsideCanvasViewModel;
var _frameRateMax;
var _initialCellNumber;
var soundViewModel;
var soundView;

function preload()
{
  _frameRateMax = configuration.frameRateMax;
  _initialCellNumber = configuration.cellNumber;
}


function setup() { 
const canvas = createCanvas(configuration.defaultWidth,configuration.defaultHeight);
canvas.id("canvas");
frameRate(configuration.initialFramerate);
clear();

///Object instanciation
/// Die Klassen müssen von "unten" (Model) nach oben (Gui) instanziiert werden
startRule = startRule();
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
outsideCanvasViewModel = new OutsideCanvasViewModel ();
soundViewModel = new SoundViewModel(automaton);
soundView = new StructureWidthSoundView(soundViewModel);
leftCanvas = createGraphics(viewmodel._bufferWidth, height);
rightCanvas = createGraphics(viewmodel._bufferWidth, height);
mainView = new View(viewmodel, leftCanvas);
additionalView = new DefaultView(viewmodel, rightCanvas);
viewHandler = new ViewHandler(mainView, additionalView);
gui = new Gui(viewmodel, viewHandler);
outsideCanvasView = new OutsideCanvasView();

//Object Initialsisierung
automaton.initialise(viewmodel.convertDecimalRule(startRule), _initialCellNumber);
viewmodel.initialise();
additionalView.initialise();
mainView.initialise();
gui.initialise();
outsideCanvasView.initialise();
soundViewModel.initialise();
soundView.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
automaton.subscribe(outsideCanvasViewModel);
automaton.subscribe(soundViewModel);
viewmodel.subscribe(mainView);
viewmodel.subscribe(additionalView);
viewmodel.subscribe(gui);
soundViewModel.subscribe(soundView);
outsideCanvasViewModel.subscribe(outsideCanvasView);


noLoop(); //Draw soll erst durch Klicken auf den Run-Button ausgeführt werden
}
////////////////////////Setup Ende///////////////////////////////////////////////////////////////


function draw() 
{     
  automaton.generateGeneration();
}

function windowResized()
{
  
}

/*
  Diese Klasse liefert beim Start des Programms die Regel, mit der der Automat initialisiert wird.
  Das Array startRuleArray enthält Regeln mit unterschiedlichem interessanten Verhalten, von denen eine
  zufällige zurückgegeben wird.
*/
function startRule()
{
  const startRuleArray = [110,30,45,90,150,250,129,105,99,182,225,197,147,131,18,118,13,73,137,124];
  const randomIndex = Math.floor(Math.random()*startRuleArray.length);
  const rule = startRuleArray[randomIndex];
  return rule;
}
