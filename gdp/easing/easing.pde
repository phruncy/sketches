float centerX, centerY;
float radius = 0;
float ease = 0.025;

void setup() {
  size(500, 500);
  centerX = width / 2;
  centerY = height / 2;
}
void draw() {
  background(255);
  
  float distance = dist(mouseX, mouseY, centerX, centerY);
  float difference = distance - radius;
  radius += difference * ease;
  
  // draw circle
  ellipse(centerX, centerY, radius * 2, radius * 2);
  
  
  line(centerX, centerY-10, centerX, centerY +10);
  line(centerX - 10, centerY, centerX + 10, centerY);
}
