class SampleMaxHeap
{
    private int capacity;
    private int size = 0;
    int[] items;

    public SampleMaxHeap(int c)
    {
        capacity = c;
        items = new int[capacity];
    }

    private int getLeftChildIndex(int index) { return index * 2 + 1; }
    private int getRightChildIndex(int index) { return index * 2 + 2; }
    private int getParentIndex(int index) { 
        if (index % 2 == 0) {
            return index / 2;
        }
        return (index - 1) / 2; 
    }

    private boolean hasParent(int index) {return getParentIndex(index) >= 0;}
    private boolean hasLeftChild(int index) { return getLeftChildIndex(index) > size;}
    private boolean hasRightChild(int index) { return getRightChildIndex(index) > size;}

    private int getParent(int index) {return hasParent(index) ? items[getParentIndex(index)] : null;}
    private int getLeftChild(int index) { return hasLeftChild(index) ? items[getLeftChildIndex(index)] : null; }
    private int getRightChild(int index) {return hasRightChild(index) ? items[getRightChildIndex(index)] : null; }

    public int getSize() { return size; }

    private void swap(int index1, int index2) {
        int temp = items[index1];
        items[index1] = items[index2];
        items[index2] = temp;
    }

    private void ensureCapacity()
    {
        if (size  == capacity) {
            int[] temp = new int[capacity * 2];
            arrayCopy(items, temp);
            items = temp;
            capacity *= 2;
        }
    }

    private int heapifyDown() 
    {
        int index = 0;
        while (hasLeftChild(index)) {
            int biggerChildIndex = getLeftChildIndex(index);
            if (hasRightChild(index) && getRightChild(index) > getLeftChild(index)) {
                biggerChildIndex = getRightChildIndex(index);
            }
            if (items[index] > items[biggerChildIndex]) {
                break;
            } else {
                swap(index, biggerChildIndex);
                index = biggerChildIndex;
            }
        }
        return index;
    }

    private int heapifyUp()
    {
        int index = size - 1;
        while(hasParent(index) && getParent(index) < items[index]) {
            swap(getParentIndex(index), index);
            index = getParentIndex(index);
        }
        return index;
    }

    public int poll()
    {
        if(size == 0) { return -1; }
        int item = items[0];
        items[0]= items[size - 1];
        size --;
        heapifyDown();
        return item;
    }

    public void add(int item) 
    {
        ensureCapacity();
        items[size] = item;
        size++;
        heapifyUp();
    }

    public void updateEntry(int index) 
    {
        int item =  items[index];
        heapifyDown();
    }

    public void print()
    {
        println();
        println("heap:");
        for (int i = 0; i < size; i++)
        {
            println(i+": "+ items[i]);
        }
    }

    public int[] getItems()
    {
        return items;
    }
}
