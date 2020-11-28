class Gui extends Observable implements Observer
{
  // Konstruktor
  public Gui()
  {
    this.addObserver(viewMode);
  }
  
  public void update (Observable o, Object arg)
  {
    
  }
}
