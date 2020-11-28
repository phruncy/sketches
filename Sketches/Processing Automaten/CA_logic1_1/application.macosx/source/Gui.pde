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
        void controlEvent (CallbackEvent theEvent) 
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
        void controlEvent (CallbackEvent theEvent) 
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
        void controlEvent (CallbackEvent theEvent) 
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
        void controlEvent (CallbackEvent theEvent) 
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
      _automaton._ruleset[i] = int(_ruleCheckBox.getArrayValue()[i]);
      println("hui");
    }
  }
}
