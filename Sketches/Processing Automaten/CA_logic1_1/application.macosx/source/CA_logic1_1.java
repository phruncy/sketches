import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.Observer; 
import java.util.Observable; 
import controlP5.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class CA_logic1_1 extends PApplet {





Automaton automaton;
DefaultViewModel viewModel;
DefaultView view;
Gui gui;


/// vorläufig!
public int ruleNr = 110;


public void setup ()
{  
  
  
  
  
  // Setup der MVVM-Komponenten
  automaton = new Automaton();
  viewModel = new DefaultViewModel(automaton);
  view = new DefaultView(viewModel);
  gui = new Gui(automaton, viewModel,view, this);
  
  //Setup Observer
  automaton.addObserver(viewModel);
  viewModel.addObserver(view);
  viewModel.addObserver(gui);
  
  //Initalisierung des Automaten
  automaton.initialise(viewModel.convertDecimalRule (ruleNr), viewModel.calculateCellNumber());
  println ("setup done");
  
  //Initialisierung der Grafischen Ausgabe
  view.initialise();
}

public void draw()
{
    if (viewModel._runnable)
    {
      if(view.getIsRendered())
      {
       automaton.generateGeneration();
      }  
    }
  
}
class Automaton extends Observable 
{
  private int _generationCount;
  private int _cellCount;
  private int [] _ruleset = new int[8];
  private Cell [] _cell;
  private boolean _isCyclic;
  
  //Konstruktor
  
  public Automaton ()
  {
    this._generationCount = 0;
    _isCyclic = false;
  }
  
  /// Setter/getter
  
  //wird von ViewMode aufgerufen, wenn sich eine Änderung in den Grafischen Parametern ergibt
  public int getGenerationCount()
  {
    return _generationCount;
  }
  
  public void setCellCount(int NewCellCount)
  {
    _cellCount = NewCellCount;
  }
  
  public void setRuleSet (int [] newRuleset )
  {
    _ruleset = newRuleset;
  }
  
   public void setIsCyclic(boolean value)
  {
     _isCyclic = value;
  }
  
  
  /// Methoden
  
  // Stellt standardmäßig eine einzelne lebendige Zelle in der Mitte des Zellraums als Startwert ein.
  private void initialiseState()
  {
    _cell[_cellCount/5].setState(1);
  }
  
   public void setNeighbours (Cell cell)
  {
    cell.leftNeighbour = _cell[cell._position-1];
    cell.rightNeighbour = _cell[cell._position+1];
  }
  
  //Methoden, die logisch den Wechsel zwischem berenztem und zyklischem Zellularraum ermöglichen
  ///verbindet die ersten und letzte Zelle eines Arrays per Nachbarschaftszuweisung zu einem Ring
  public void closeCircle()
  {
    _cell[0].setLeftNeighbour(_cell[_cell.length-1]);
    _cell[0].setRightNeighbour(_cell[1]);
    _cell[_cell.length-1].setLeftNeighbour(_cell[_cell.length-2]);
    _cell[_cell.length-1].setRightNeighbour(_cell[0]);
  }
  
  ///löscht die Nachbarchaftbeziehungen der ersten und letzten Zelle 
  public void disconnectCircle()
  {
    _cell[0].setLeftNeighbour(null);
    _cell[0].setRightNeighbour(null);
    _cell[_cell.length-1].setLeftNeighbour(null);
    _cell[_cell.length-1].setRightNeighbour(null);
  }
  
  /// setzt den Automaten zurück: setzt alle Zellparameter und _generationCount auf 0
  
  public void resetAutomaton()
  {
    for (int i=0; i<_cell.length; i++)
    {
      _cell[i].reset();
    }
    _generationCount = 0;
  }
  
  /// initialisiert den Automaten im Setup:
  /// ein neues Zell-Array wird erzeugt und all seine Werte werden auf 0 gesetzt.
  /// Die Nachbarn werden verknüpt
  /// Falls "Cyclic" aktiv ist, werden die Zellen mit index 0 und maximum ebenfalls miteinander verknüpft;
  public void initialise(int[]ruleSet, int cellCount)
  {   
    _ruleset = ruleSet;
    _cellCount = cellCount;
    _cell = new Cell[_cellCount];
    for (int i=0; i<_cell.length; i++)
    {
      _cell[i]= new Cell(0);
      _cell[i].setPosition(i);
    
      if (i>1 && i<_cell.length)
      {
        setNeighbours(_cell[i-1]);
      }
    }
    initialiseState();
  }
  
  
  /// berechnet den neuen Zustand des gesamten Automaten 
  /// Vor der Berechnung wird überprüft, ob ob die jeweilige Zelle über Nachbarn verfügt 
  /// Tote Randzellen im Nicht-zyklischen modus werden so ausgelassen
  public void generateGeneration()
  {    
    for (int i =0; i< _cell.length; i++)
    {
      if (_cell[i].leftNeighbour != null )
      {
        _cell[i].generateCellParameters();
      }
    }
    _generationCount++;
    println(_generationCount);
    setChanged();
    notifyObservers();
  }
}
class Cell
{
  private int _state;
  private int _formerState;
  private int _age;
  private int _position;
  private Cell leftNeighbour;
  private Cell rightNeighbour;
  
    ///Konstruktor
  
  public Cell (int initialState)
  {
    this._state = initialState;
    this._formerState = 0;
    this._age=0;
  }
  
  ///getter + setter
  
  public int getState()
  {
    return this._state;
  }
  
  public void setState(int state)
  {
    this._state = state;
  }
  
  public int getPosition()
  {
    return this._position;
  }
  
  public void setPosition(int position)
  {
    this._position = position;
  }
  
  public int getAge()
  {
    return this._age;
  }
  
  public void setRightNeighbour (Cell cell)
  {
    this.rightNeighbour = cell;
  }
  
  public void setLeftNeighbour (Cell cell)
  {
    this.leftNeighbour = cell;
  }
  
  ///Klassenmethode
  
  //// Übergabeargumente sind die Zustände der beiden Nachbarzellen
  //// unbinary(triplet) gibt als Ergebnis den Index des ruleset[]-Array-Elements zurück,
  //// das den neuen Zellzustand enthält
  private int calculateState (int l,int r)
  {
    String triplet= "";
    triplet = triplet + l+this._state+r;
    return automaton._ruleset[unbinary(triplet)];
  }
  
  
  public void generateCellParameters()
  {
    int left = (_position == 0)? leftNeighbour._state : leftNeighbour._formerState;
    int right = (_position == (automaton._cell.length)-1)? rightNeighbour._formerState : rightNeighbour._state;
    
    _formerState = _state;
    _state = calculateState (left, right);
    setAge();
  }  
  
  
 private void setAge ()
  {
    _age = ((_state ==1) && (_formerState ==1))? _age++ : 0; 
  }
    
 public void reset ()
 {
   _state = 0;
   _age = 0;
   _formerState = 0;
 }
}
class DefaultView implements Observer
{  
  //Globals
  private DefaultViewModel vm;
  private boolean _isRendered;
  
  ///Konstruktor
  public DefaultView (DefaultViewModel viewModel)
  {
    this.vm = viewModel;
    _isRendered = true;
  }
  
  // Setter/ Getter
  public void setIsRendered(boolean value)
  {
    _isRendered = value;
  }
  
  public boolean getIsRendered()
  {
    return _isRendered;
  }
  
  
  
  /// Methoden 
  public void update(Observable observable, Object arg)
  {
    render(automaton);
  }
  
  //Setup der grafischen Anzeige
  
  public void initialise()
  {
    background(vm.getBackgroundColor());
    fill(vm.getDisplayPanelColor());
    rect (vm._outputPanelEdgeLeft, vm._outputPanelTop, vm.getDisplayPanelSizeX(), vm.getDisplayPanelSizeY() );
  }
 
  ///leert die grafische Anzeige und setzt den Automaten zurück
  public void clearAll(Automaton automaton)
  {
    automaton.resetAutomaton();
    background(vm.getBackgroundColor());
    fill(vm.getDisplayPanelColor());
    rect (vm._outputPanelEdgeLeft, vm._outputPanelTop, vm.getDisplayPanelSizeX(), vm.getDisplayPanelSizeY() );
    vm.setRunnable(false);
  }
  
  ///rendert die aktuelle Generation
  public void render(Automaton automaton)
  {
    for (int i= 0; i<automaton._cell.length; i++)
    {
      fill(viewModel.generateCellColor());
      noStroke();
      if (automaton._cell[i]._state == 1)
      {
        rect(vm.getCellPositionX(i), vm.getCellPositionY(automaton), vm.getCellSize(), vm.getCellSize());
      }
      setIsRendered(true);
    }

    
  }
}
class DefaultViewModel extends Observable implements Observer
{
  // globale Variablen
  private Automaton _automaton;
  
  private int _cellSize = 2;//!!!!!!!!!!!! Wird später von GUI übergeben!
  private int _horizontalSpacing = 0;//"        "        "         "    "   "
  private int _edge = 0;//   " "   "           "         "    "   "
  private int _verticalSpacing;
  private boolean _runnable;
  
  /// Konstanten für Berechung der View:
  public final int _outputPanelTop = 100;
  public final int _outputPanelBottom =50;
  public final int _outputPanelEdgeLeft = 50;
  public final int _outputPanelEdgeRight =50;

  
  //Konstruktor
  public DefaultViewModel (Automaton automaton)
  {
    _automaton = automaton;
    _runnable = false;
  }
  
  public void update(Observable observable, Object arg )
  {
    setChanged();
    notifyObservers();
  }
  
  //Getter und Setter
  
  public void setCellSize(int newCellSize)
  {
    _cellSize = newCellSize;
  }
  
  public int getCellSize()
  {
    return _cellSize;
  }
  
  public boolean getRunnable()
  {
    return _runnable;
  }
  public void setRunnable(boolean value)
  {
    _runnable = value;
  }

  //Methoden
  /// berechnet die Länge des cell[] Arrays besierund auf der eingegebenen Zellgröße
  public int calculateCellNumber()
  {
    int numberOfCells = (getDisplayPanelSizeX ()- 2*_edge)/(_cellSize + _verticalSpacing); //!!!!!!!!!!!!
    return numberOfCells;
  }
  
  ///konvertiert die  dezimale Regelnummer in ein int-Array
  public int[] convertDecimalRule (int decimalRuleNumber) 
  {
    int [] newRuleSet = new int[8];
    int modulo = decimalRuleNumber;
    for (int n= 0; n<newRuleSet.length; n++)
    {
      newRuleSet [n] = modulo % 2;
      modulo = modulo/2;
    }
    return newRuleSet;
  }
  
  /// Methoden zur Berechung der Position der grafischen Zellen
  public int getCellPositionX (int indexOfCell)
  {
    int posX = indexOfCell* (_horizontalSpacing + _cellSize) + _edge + _outputPanelEdgeLeft;
    return posX;
  }
  
  public int getCellPositionY (Automaton automaton)
  {
    int posY = (automaton.getGenerationCount()+ _verticalSpacing)* _cellSize + _outputPanelTop;
    return posY;
  }
  
  
  
  //// Methoden zur Einstellung von Größen- und Farbparametern
  ///gibt die Farbe der in der View ausgegebenen Zelle zurück
  public int generateCellColor()
  {
    int cellColor = (255); ////!!!! Später von der Gui aus einstellbar!
    return cellColor;
  }
  
  public int getBackgroundColor()
  {
    int backgroundColor = (100);
    return backgroundColor;
  }
  
  public int getDisplayPanelColor()
  {
    int displayColor = (0);
    return displayColor;
  }
  
  public int getDisplayPanelSizeX ()
  {
    int displayPanelSizeX = width - (_outputPanelEdgeLeft + _outputPanelEdgeRight);
    return displayPanelSizeX;
  }

  public int getDisplayPanelSizeY ()
  {
    int displayPanelSizeY = height - (_outputPanelBottom + _outputPanelTop);
    return displayPanelSizeY;
  }
  
  
 
}
class Gui implements Observer
{
  //Deklarationen
  Automaton _automaton;
  DefaultViewModel _viewModel;
  DefaultView _view;
  ControlP5 _cp5;
  CheckBox _ruleCheckBox;
  Button _runPause;
  Button _renderOneFrame;
  Button _resetButton;
  Toggle _cyclicOnOff;
  
  // Konstruktor
  public Gui(Automaton automaton, DefaultViewModel viewModel,DefaultView view,PApplet pApplet )
  {
    _automaton = automaton;
    _viewModel = viewModel;
    _view = view;
    _cp5 = new ControlP5(pApplet);
    _ruleCheckBox = _cp5.addCheckBox("regel")
                       .setPosition(_viewModel._outputPanelEdgeLeft, 20)
                       .setSize(20,20)//größe der einzelnen Box
                       .setItemsPerRow(8)
                       .setSpacingColumn(30)
                       .setSpacingRow(20)
                       .addItem("111", 0)
                       .addItem("110", 50)
                       .addItem("101", 100)
                       .addItem("100", 150)
                       .addItem("011", 200)
                       .addItem("010", 255)
                       .addItem("001", 200)
                       .addItem("000", 255)
                       ;
                      
    _runPause = _cp5.addButton("play")
                   .setPosition(500,20)
                   .setSize(50,50)
                   .setValue(0)
                   ;
    _runPause.addCallback(new CallbackListener(){
        public void controlEvent (CallbackEvent theEvent) 
        {
          if (theEvent.getAction()==ControlP5.ACTION_BROADCAST)
            {runPause();}
        }
      });
    
    _renderOneFrame = _cp5.addButton("renderFrame")
                             .setPosition(600,20)
                             .setSize(50,50)
                             ;
    _renderOneFrame.addCallback(new CallbackListener(){
        public void controlEvent (CallbackEvent theEvent) 
        {
          if (theEvent.getAction()==ControlP5.ACTION_BROADCAST)
            {renderOneFrame();}
        }
      });
      
    _resetButton = _cp5.addButton("reset")
                       .setPosition(700,20)
                       .setSize(50,50)
                       .setValue(0);
    _resetButton.addCallback(new CallbackListener(){
        public void controlEvent (CallbackEvent theEvent) 
        {
          if (theEvent.getAction()==ControlP5.ACTION_BROADCAST)
            {reset();}
        }
      });                   
    _cyclicOnOff = _cp5.addToggle("cyclic")  
                       .setPosition(800,20)
                       .setSize(50,20)
                       .setValue(false)
                       .setMode(ControlP5.SWITCH);
    _cyclicOnOff.addCallback(new CallbackListener(){
        public void controlEvent (CallbackEvent theEvent) 
        {
          if (theEvent.getAction()==ControlP5.ACTION_BROADCAST)
            {cyclicOnOff(_cyclicOnOff.getState());}
        }
      });                   
  }
  
  public void update (Observable o, Object arg)
  {
    
  }
  
  ///Methoden
  public void controlEvent(ControlEvent theEvent) {
  println(theEvent.getController().getName());
  }
  
  public void runPause()
  {
    _viewModel.setRunnable(!_viewModel.getRunnable());
    println("click!");    
  }
  
  public void renderOneFrame ()
  {
    automaton.generateGeneration();
  }
  
  public void reset ()
  {
    _view.clearAll(automaton);
    _automaton.initialiseState();
  }
  
  public void cyclicOnOff(boolean flag)
  {
    _viewModel.setRunnable(false);
    if (flag==true)
    {
      _automaton.closeCircle();
    }
    else
    {
      _automaton.disconnectCircle();
    }
  }
  
  public void rule ()
  {
    for (int i=0; i< _ruleCheckBox.getArrayValue().length; i++)
    {
      _viewModel.setRunnable(false);
      _automaton._ruleset[i] = PApplet.parseInt(_ruleCheckBox.getArrayValue()[i]);
      println("hui");
    }
  }
}
  public void settings() {  size(1000,700); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "CA_logic1_1" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
