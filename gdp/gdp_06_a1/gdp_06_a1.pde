void setup() {
  size(500, 500);
}
void draw() {
  background(255);
  for (int i = 0; i < 50; i++) {
    line(0, i * 10, i * 10, 0);
    line(i * 10, height, width, i * 10);
  }
}
