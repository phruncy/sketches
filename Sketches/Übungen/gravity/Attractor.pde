class Attractor
{
  PVector location;
  float _mass;
  
  Attractor(float mass, float locationX, float locationY)
  {
    _mass = mass;
    location = new PVector (locationX, locationY);
  }
  
  
  PVector getLocation()
  {
    return this.location;
  }
  
  float getMass()
  {
    return this._mass;
  }
  
  void display()
  {
    noStroke();
    fill (100,50,200);
    ellipse(location.x, location.y, _mass*4, _mass*4);
  }
}
