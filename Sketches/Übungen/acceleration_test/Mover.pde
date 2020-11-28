class Ball 
{
  PVector _location;
  PVector _velocity;
  PVector _acceleration;
  float _maxSpeed;
  float _mass;
  
  public Ball(float mass, float x, float y)
  {
    _mass = mass;
    _location = new PVector (x, y);
    _velocity = new PVector(0,0);
    _acceleration =new PVector(0,0);
    _maxSpeed = 5.0;
    
  }
  
  void move()
  {
    PVector mouse = new PVector(mouseX, mouseY);
    PVector mouseAttraction =  PVector.sub(mouse, _location);
    PVector gravity = new PVector (0,.1*_mass);
    float magnitude;
    magnitude = 3/ (_location.mag());
    mouseAttraction.normalize();
    mouseAttraction.mult(magnitude);
    
    /*_acceleration = direction;*/
    
    applyForce(getFriction());
    applyForce(wind);
    applyForce(gravity);
    if (isInsideLiquid(liquid))
    {
      applyForce(getDrag(liquid));
    }
    //applyForce(mouseAttraction);
    _velocity.add(_acceleration);
    //_velocity.limit(_maxSpeed);
    _location.add(_velocity);
    _acceleration.mult(0);
    checkEdges();
  }
  
  void applyForce(PVector force)
  {
    PVector _force = force.get();
    _force.div(_mass);
    _acceleration.add(_force); 
  }
  
  PVector getFriction ()
  {
    PVector friction = _velocity.get();
    //Reibungskoeffizient
    float coefficient = 0.05;
    //nomrale Kraft
    float normal = 1;
    float frictionMagnitude = normal* coefficient;
    friction.normalize();
    friction.mult(-1);
    friction.mult(frictionMagnitude); 
    return friction;
  }
  
  PVector getDrag (Liquid l)
  {
    PVector drag = _velocity.get();
    float speed = _velocity.mag();
    float _constant = l.constant;
    float dragMagnitude = _constant * speed * speed;
    
    drag.normalize();
    drag.mult(-1);
    drag.mult(dragMagnitude);
    return drag; //<>//
  }
   
  void checkEdges()
  {
    if (_location.x<0)
    {
      _velocity.x *= -1;
      _location.x = 0;
    }
    else if(_location.x> width)
    {
      _velocity.x *= -1;
      _location.x = width;
    }  
    if (_location.y > (height-_mass*5/2))
    {
      _velocity.y *= -1;
      _location.y = height- _mass*5/2;
    } 
  }
  
  boolean isInsideLiquid (Liquid l)
  {
    if (_location.x > l._x && _location.x< l._x + l._liquidWidth && _location.y> l._y && _location.y < l._y + l._liquidHeight)
    {
      return true;
    }
    else
    {
      return false;
    }
    
  }
  
  void display()
  {
    ellipse(_location.x, _location.y, _mass*5, _mass*5);
  }
}
