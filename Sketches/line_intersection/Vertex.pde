public class Vertex
{
  private PVector _position;
  public Vertex(float x, float y) {
    _position = new PVector(x, y);
  }
  
  void draw() 
  {
    push();
      fill(0, 255, 255);
      ellipse(_position.x, _position.y, 10, 10);
    pop();
  }
  
  public PVector position() {
    return _position;
  }
  
  public float x()
  {
    return _position.x;
  }
  
  public float y() {return _position.y;}
  
  public boolean checkCollision(float x, float y, float tolerance) 
  {
    if (dist(_position.x, _position.y, x, y) < tolerance) {return true;}
    return false;
  }
  
  public void update(float x, float y) {
    _position.x = x;
    _position.y = y;
  }
}
