class Mover
{
  PVector location;
  PVector velocity;
  PVector acceleration;
  float _mass;
  
  Mover(float mass, float locationX, float locationY)
  {
    _mass = mass;
    location = new PVector (locationX, locationY);
    velocity = new PVector(0,0);
    acceleration = new PVector(1,1);
  }
  
  void applyForce(PVector force)
  {
    PVector f =  PVector.div(force, _mass);
    acceleration.add(f);
  }
  
  PVector getLocation()
  {
    return this.location;
  }
  
  float getMass()
  {
    return this._mass;
  }
  
  void update()
  {
    applyForce(getAttraction(attractor));
    
    velocity.add(acceleration);
    location.add(velocity);
    acceleration.mult(0);
  }
  
  void display()
  {
    fill (100,50,200);
    ellipse(location.x, location.y, _mass*4, _mass*4);
  }
  
  PVector getAttraction (Mover mover)
  {
    
    PVector _attraction = PVector.sub(location, mover.getLocation());
    Float _distance = _attraction.mag();
    PVector _direction = _attraction.normalize();
    float strength = (g * this._mass * mover.getMass()) / (_distance * _distance);
    
    _attraction.normalize();
    _attraction.mult(strength);
    
   return _attraction;
  }

}
