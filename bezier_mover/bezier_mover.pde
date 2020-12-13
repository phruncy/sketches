float t = 0;
int phase = 0;
final int PHASES = 2;
float speed = 0.5;

void setup() {
  size(500, 500);
  
}
void draw() {
  background(255);
  noFill();
  bezier(50, 450, 450, 450,50, 50, 450, 50 ); // curve 1
  bezier(450, 50, 450, 200, 450, 450, 50, 450); //curve 2
  update();

  float x = 0, y = 0;
  switch(phase) {
    case 0:
      x = bezierPoint(50, 450, 50, 450, t);
      y = bezierPoint(450, 450, 50, 50, t);
      break;
    case 1:
      x = bezierPoint(450, 450, 450, 50, t);
      y = bezierPoint(50, 200, 450, 450, t);
      break;
  }
  fill(255, 0, 0);
  ellipse(x, y, 10, 10);
}

void update() {
  t += speed / frameRate;
  if (t > 1) {
    t = 1 - t;
    phase = (phase+1) % 2;
  }
}
