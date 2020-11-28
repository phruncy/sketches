float g = .1;
Mover mover; 
Attractor attractor; 

void setup()
{
  size(500, 500);
  mover = new Mover(4,100,100);
  attractor = new Attractor(20, width/2, height/2);
}

void draw()
{
  background(255);
  attractor.display();
  
  mover.update();
  mover.display();
}
