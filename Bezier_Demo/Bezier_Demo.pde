/**
 * A short interactive demo ob quadric and cubic bezier curves
 * @autor Franziska Schneider
 *
 * All information about bezier curves taken from:
 * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curve
 * and https://vimeo.com/106757336
 */

ArrayList<PVector> controls; // List of all control points
Bezier curve; // the demo curve
PVector active = null; // the grabbed curve
float timer;
final float DELTA = 10; // point grabbin tolerance radius
final float MAXSPEED = 0.2;

void setup() {
  size(500, 500);
  controls = new ArrayList<PVector>();
  initCubic();
}

void draw() 
{
  background(255);
  timer += (MAXSPEED / frameRate);
  // update currenty selected point
  if (active != null) active.set(mouseX, mouseY);
  
  curve.draw(color(0), 2);
  float t = sin(2*PI*timer)*0.5 + 0.5;
  curve.drawDebug(t);
  curve.drawHandlers();
  
  // info text
  fill(0);
  text("Tweak around the handles to deform the curve\nPress Q: switch to quadric curve\nPress C: switch to cubic curve", 20, 20);
}

// select curve control points on mousePressed
void mousePressed() {
  for (PVector p: controls) {
    if (dist(mouseX, mouseY, p.x, p.y) < DELTA) {
      active = p;
      break;
    }
  }
}

// release grabbed point
void mouseReleased() {
  active = null;
}

// switch between quadric and cubic curve by pressing keys
void keyPressed() {
  if (key == 'c') {
    initCubic();
  } else if (key == 'q') {
    initQuad();
  }
}

// initializes a quadric curve
void initQuad() {
  controls.clear();
  PVector p0 = new PVector(50, 450);
  PVector p1 = new PVector(50, 60);
  PVector p2 = new PVector(450, 60);
  controls.add(p0);
  controls.add(p1);
  controls.add(p2);
  curve = new QuadBezier(p0, p1, p2);
}

// initializes a cubic curve
void initCubic() {
  controls.clear();
  PVector p0 = new PVector(50, 450);
  PVector p1 = new PVector(50, 60);
  PVector p3 = new PVector(450, 450);
  PVector p2 = new PVector(450, 60);
  controls.add(p0);
  controls.add(p3);
  controls.add(p1);
  controls.add(p2);
  curve = new CubicBezier(p0, p1, p2, p3);
}
