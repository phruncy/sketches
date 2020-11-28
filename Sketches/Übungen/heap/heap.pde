SampleMaxHeap heap;

void setup()
{
    size(400, 400);
    noLoop();
    heap = new SampleMaxHeap(10);
    heap.add(5);
}

void draw()
{
    background(0);
    int[] items = heap.getItems();
    for (int i = 0; i < heap.getSize(); i++) {  
       text(items[i], 50, i * 20 + 50);
    }
    int random = (int)random(100);
    heap.add(random);
}

void mouseClicked()
{
    redraw();
}

void keyPressed()
{
  int index = (int)random(heap.getSize());
  heap.updateEntry
}
