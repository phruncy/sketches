float distance = 0;
boolean entered = false;

void setup() {
  size(500, 500);
  fill(0);
}

void draw() 
{
  background(255);
  
  // distance in one frame
  float dlocal = dist(pmouseX, pmouseY, mouseX, mouseY);
  
  // if mouse is not in window yet, set dlocal back to 0
  if (pmouseX == 0 && pmouseY == 0 && !entered) {
    dlocal = 0;
  } else {
    entered = true;
  }
  
  distance += dlocal;
  
  textSize(20);
  text("Distance: " + round(distance), 100, 100);
}
