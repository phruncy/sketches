public class Particle 
{
  private PVector _position;
  private float _maxSize, _size;
  private float _lifetime, _startTime, _age;
  private float maxSpeed = 500;
  private PVector _velocity;
  
  public Particle(PVector origin, float size, PVector velocity, float time)
  {
    _size = size;
    _maxSize = size;
    _position = origin;
    _lifetime = time;
    _age = 0;
    _startTime = millis();
    _velocity = velocity;
  }
  
  public void update() 
  {
    _position.add(_velocity.copy().mult(1 / frameRate));
    _age = millis() - _startTime;
    _size = max((1 - (_age / _lifetime)) * _maxSize, 0); 
  }
  
  public void display() 
  {
    pushMatrix();
    translate(_position.x, _position.y, _position.z);
    fill(255);
    sphere(_size);
    popMatrix();
  }
  
  public boolean hasExpired()
  {
    return _age > _lifetime;
  }
  
  public void applyForce(PVector force) 
  {
    _velocity.add(force);
    if (_velocity.magSq() > maxSpeed * maxSpeed) {
      _velocity.setMag(maxSpeed);
    }
  }
}
