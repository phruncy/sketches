/*
 * Scared goat: minimal example using PVector
 * @author Franziska Schneider
 */

PVector goat, center;
final float radius = 200, goatRadius = 10;

void setup() {
  size(500, 500);
  center = new PVector(width / 2, height / 2);
}

void draw() {
  // goat's realtive position from center:
  // create from copy: vector pointing away from mouse to center
  // set magnitude to circle radius because goat is always on the edge
  goat = center.copy()
               .sub(mouseX, mouseY)
               .setMag(radius - goatRadius); 
  
  background(255);
  // draw center
  circle(center.x, center.y, radius*2);
  // draw goat: add goat vector to center coordinates
  circle(goat.x + center.x, goat.y + center.y, goatRadius*2);
}
