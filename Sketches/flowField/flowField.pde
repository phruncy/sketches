PVector[][] flowField;
int cellWidth = 30;
int cellHeight = 30;

void setup() {
  flowField = new PVector[width / cellWidth][height / cellHeight];
  float scale = 0.05;
  
  size(800, 500);
  for (int x = 0; x < width / cellWidth; x ++) {
    for (int y = 0; y < height / cellHeight; y++) {
      float angle = map(noise(x*scale, y*scale), 0, 1, 0, TWO_PI);
      flowField[x][y] = new PVector(sin(angle), cos(angle));
    }
  }
}
void draw() {
  background(255);
  drawDebug();
}

void drawDebug() 
{
  for (int x = 0; x < width / cellWidth; x++) {
    for (int y = 0; y < height / cellHeight; y++) {
      pushMatrix();
      translate(x*cellWidth, (y + 1)*cellHeight);
      float angle = atan2(flowField[x][y].x, flowField[x][y].y);
      rotate(angle);
      line(0, 0, cellWidth, 0);
      fill(255, 0, 0);
      ellipse(0, 0, 3, 3);
      popMatrix();
    }
  }
}
