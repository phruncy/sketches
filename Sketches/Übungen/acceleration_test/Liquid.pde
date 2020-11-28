class Liquid 
{
  float _x, _y, _liquidWidth, _liquidHeight;
  float constant;
  
  Liquid(float x, float y, float w, float h, float c)
  {
    _x= x;
    _y= y;
    _liquidWidth = w;
    _liquidHeight = h;
    constant = c;
    
  }
  
  void display ()
  {
    noStroke();
    fill(200);
    rect(_x, _y, _liquidWidth, _liquidHeight);
  }
}
