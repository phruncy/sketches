int x;
void setup() 
{
  size(600, 400);
}

void function1() {
  rect (x, 200, 20, 20);
  x+=40;
}

void function3() {
  rect (x, 200, 40, 20);
  x+=60;
}

void function2() {
  function3();
  function3();
  function3();
  function1();  
}

void draw() {
  x=100;
  rect (x, 200, 20, 20);
  x+=40;
  function1();
  rect (x, 200, 20, 20);
  x+=40;
  function2();
  function1();  
  function1();  
}
