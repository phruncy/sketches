var automaton;
var viewmodel;
var view ;
var gui;
var canvas;

function setup() {
canvas = createCanvas(500,500);
background(0);

///Object instanciation
automaton = new Automaton();
viewmodel = new ViewModel(automaton);
view = new View(viewmodel);
gui = new Gui(viewmodel, view);

//Object Initialsisierung
automaton.initialise(viewmodel.convertDecimalRule(150), 100);
viewmodel.initialise();
view.initialise();

//Observeranmeldung
automaton.subscribe(viewmodel);
viewmodel.subscribe(view);

noLoop(); //Draw soll erst durch Klicken auf den Run-Button ausgeführt werden

////////////////////////Setup Ende///////////////////////////////////////////////////////////////
}

function draw() 
{     
  automaton.generateGeneration();
}

function windowResized()
{
  resizeCanvas(windowWidth,windowHeight);
}
