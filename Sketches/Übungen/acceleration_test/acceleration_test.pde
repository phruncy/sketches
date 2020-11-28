Ball[] balls;
Liquid liquid;
PVector wind;



void setup()
{
  balls = new Ball[5];
  wind = new PVector(0.005, 0);
  liquid = new Liquid(0, height/2, width, height/2,  0.1);
  size(500,500);
  background(255);
  for (int i = 0; i< balls.length; i++)
  {
    balls[i] = new Ball(random(1,10), random(width), 0);
  }
  
}

void draw()
{
  fill(255,50);
  rect(0,0, width, height);
  liquid.display();
  fill(100, 50, 100); //<>//
  for (int i = 0; i< balls.length; i++)
  {
   balls[i].move();
   balls[i].display();
  }  
}
