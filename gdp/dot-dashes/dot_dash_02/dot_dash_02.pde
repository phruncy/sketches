int x; // Position of next rectangle

void setup() {
  size(600, 400);
}

// draw short rectangle, increment x
void morseDot() {
  rect (x, 200, 20, 20);
  x+=40;
}

// draw long rectangle, increment x
void morseDash() {
  rect (x, 200, 40, 20);
  x+=60;
}

// draw three short rectangles, increment x
void morseS() {
  morseDot();  morseDot();  morseDot();
}

// draw 3 long rectangles, increment x
void morseO() {
 morseDash(); morseDash(); morseDash();
}

void draw() {
  x=100;
  morseS();
  morseO();
  morseS();
}
