   Line line;
   ArrayList<Vertex> vertices;
   ArrayList<Line> lines;
   Vertex vBuffer;
   Vertex active;
   
   void setup() {
  size(500, 500);
  vertices = new ArrayList<Vertex>();
  lines = new ArrayList<Line>();
  vBuffer = null;
  }
void draw() {
  background(255);
  if (active != null) {
    active.update(mouseX, mouseY);
  }
  for (Vertex v: vertices) {
      v.draw();
  }
  for (Line l: lines) {
    l.draw();
  }
  if (vBuffer != null) {
    line(vBuffer.x(), vBuffer.y(), mouseX, mouseY);
  }
  
}

void addVertex(float x, float y) 
{
  vertices.add(new Vertex(x, y));
}

void mouseClicked()
{
  switch (key) {
    case 'v': {
      println("yo");
      addVertex(mouseX, mouseY);
      break;
    }
    case 'l': {
      if (vBuffer == null) {
        for (Vertex v: vertices) {
          if (v.checkCollision(mouseX, mouseY, 5)) {
            vBuffer = v;
            break;
          }
        }
        if (vBuffer == null) {vBuffer = new Vertex(mouseX, mouseY);}
        vertices.add(vBuffer);
      } else {
        Vertex v2 = null;
        for (Vertex v: vertices) {
          if (v.checkCollision(mouseX, mouseY, 5)) {
            v2 = v;
          }
        }
        if (v2 == null) {
          v2 = new Vertex(mouseX, mouseY);
          vertices.add (v2);
        }
        Line l = new Line(vBuffer, v2);
        lines.add(l);
        vBuffer = null;
      }
      break;
    }
    case 'm': {
      if (active == null) {
        for (Vertex v: vertices) {
          if (v.checkCollision(mouseX, mouseY, 10)) {
            active = v;
          }
        }
      } else {
        active = null;
      }
    }
    break;
  }
}
