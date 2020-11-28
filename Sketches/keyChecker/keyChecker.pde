String keyName;

void setup() {
  size(400, 400);
}
void draw() {
  background(255);
  if (keyPressed) {
      background(66, 245, 209);
      if (key == CODED) {
        keyName = String.valueOf(keyCode);
      }
      else {
        keyName = String.valueOf(key);
      }
  } else {
    keyName = "no key pressed";
  }
  fill(0);
  textAlign(CENTER);
  textSize(40);
  text(keyName, width / 2, height / 2);
}
