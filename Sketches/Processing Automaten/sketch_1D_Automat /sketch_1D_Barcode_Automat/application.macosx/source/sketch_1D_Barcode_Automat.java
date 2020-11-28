import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_1D_Barcode_Automat extends PApplet {



CellularAutomaton ca;

public void setup() 
{
  
  background(0);
  int[] ruleset = {0,1,0,1,1,0,1,0};
  ca = new CellularAutomaton(ruleset);
}

public void draw ()
{
  ca.render();//render the current generation
  ca.generate();//calculate the next generation
}

public void mousePressed ()
{
  background(0);
  ca.clearAll();
}

class CellularAutomaton 
{
  int[] cells; //Platzhalter f\u00fcr 1D-Zellenstreifen
  int generationCount;
  int cellLength;
  int cellWidth;
  
  int[] rules; //REgelset wird hier aufbewahrt
  
  //Konstruktor
  CellularAutomaton (int[] rules)
  {
    this.rules = rules;
    this.cellWidth = 2;
    this.cellLength = 50;
    this.cells = new int [width/cellWidth];// l\u00e4nge des Arrays
    clearAll();  
  }
  
  public void setRules (int[] carryR)
  {
    this.rules = carryR;
  }
  
  public void clearAll()//bereinigt das Feld
  {
    for (int i=0; i<cells.length; i++) 
    {
      cells[i]=0;
    }
    initialiseCell();  
    generationCount = 0;
  }
  
  public void initialiseCell() 
  {
    cells [cells.length/2]= 1;
  }
  
  public int executeRules(int l, int m, int r) 
  {
    if (l==1 && m == 1 && r==1) {return rules [0];}
    if (l==1 && m == 1 && r==0) {return rules [1];}
    if (l==1 && m ==0 && r== 1) {return rules [2];}
    if (l==1 && m ==0 && r== 0) {return rules [3];}
    if (l==0 && m ==1 && r== 1) {return rules [4];}
    if (l==0 && m ==1 && r== 0) {return rules [5];}
    if (l==0 && m ==0 && r== 1) {return rules [6];}
    if (l==0 && m ==0 && r== 0) {return rules [7];}   
    else {return 0;}
  }
  
  
  public void generate () 
  {
    int [] nextGeneration = new int [cells.length];
    for (int i = 1; i< cells.length -1; i++) // l\u00e4sst die Zellen am Rand aus
    {
      int left = cells[i-1];
      int thisCell = cells[i];
      int right = cells[i+1];
      nextGeneration [i]= executeRules(left, thisCell, right); //die neue generation an der Stelle i wird aus der alten berechnet      
    }
    /*for (int i=1; i<cells.length-1; i++)
    {
      cells [i]= nextGeneration [i];
    }*/
    cells = (int[]) nextGeneration.clone();//die n\u00e4chte generation wird zur aktuellen Generation
    generationCount ++;
  }
  
  public void render ()
  {
    
    for (int i= 0; i< ca.cells.length; i++)
    {
      if (cells[i] ==1) {fill (255);}
      else {fill(0);}
      noStroke();
      rect(i*cellWidth, 300, cellWidth, cellLength);
    }
  }
}
  public void settings() {  size(1080,720); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_1D_Barcode_Automat" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
