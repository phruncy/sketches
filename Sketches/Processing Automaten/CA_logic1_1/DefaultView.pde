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
      fill(vm.generateCellColor());
      noStroke();
      if (automaton._cell[i]._state == 1)
      {
        rect(vm.getCellPositionX(i), vm.getCellPositionY(), vm.getCellSize(), vm.getCellSize());
      }
      setIsRendered(true);
    }

    
  }
}
