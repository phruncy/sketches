int printcount = 0;
for (int i = 100; i < 1000; i++) {
  int h = i / 100;
  int t = (i - h*100) / 10;
  int e = i - h*100 - t*10;
  
  boolean different = (e != h)&&(h != t)&&(t != e);
  boolean ordered = h < t && t < e; 
  boolean twoTimes = (e == 2*t) || (t == 2*h) || (e == 2*h);
  boolean plusOne = (e == t+1) || (t == h+1);
  
  if (different && ordered && twoTimes && plusOne) {
    println(i);
    printcount++;
  }
}

println(printcount);
