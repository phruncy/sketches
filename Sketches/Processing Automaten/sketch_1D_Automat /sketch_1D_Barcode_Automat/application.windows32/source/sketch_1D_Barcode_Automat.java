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
int ruleNumber =30; // hier regelnummer eingeben
int[] ruleset = new int[8];
boolean is2D;
int cellPosY;



public void setup() 
{  
  
  background(0);
  is2D = true;
  convertRule (ruleNumber);
  ca = new CellularAutomaton(ruleset);
  cellPosY = ca.generationCount*ca.cellWidth;
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

public void keyPressed()
{
  background (0);
  ca.clearAll();
  is2D = !is2D;
  changeMode();
}

//wandelt die eingegebene dezimalzahl in ein bin\u00e4r bef\u00fclltes Array um
public void convertRule (int rulenumber) 
{
  int modulo = rulenumber;
  for (int n= 0; n<ruleset.length; n++)
  {
    ruleset [n] = modulo % 2;
    modulo = modulo/2;
  }
}

public void changeMode () 
{
  if (is2D)
  {
    ca.cellLength = ca.cellWidth;    
  }
  else
  {
    ca.cellLength = 50;    
  }
}

class CellularAutomaton 
{
  int[] cells; //Platzhalter f\u00fcr 1D-Zellenstreifen
  int generationCount;
  int cellLength;
  int cellWidth;
  int changeable;
  
  
  int[] rules; //REgelset wird hier aufbewahrt
  
  //Konstruktor
  CellularAutomaton (int[] rules)
  {
    this.rules = rules;
    this.cellWidth = 1;
    this.cellLength = /*50;*/ this.cellWidth;
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
    if (l==1 && m == 1 && r==1) {return rules [7];}
    if (l==1 && m == 1 && r==0) {return rules [6];}
    if (l==1 && m ==0 && r== 1) {return rules [5];}
    if (l==1 && m ==0 && r== 0) {return rules [4];}
    if (l==0 && m ==1 && r== 1) {return rules [3];}
    if (l==0 && m ==1 && r== 0) {return rules [2];}
    if (l==0 && m ==0 && r== 1) {return rules [1];}
    if (l==0 && m ==0 && r== 0) {return rules [0];}   
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
    cells = (int[]) nextGeneration.clone();//die n\u00e4chte generation wird zur aktuellen Generation
    generationCount ++;
    changeable = generationCount*cellWidth;
  }
  
  public void render ()
  {
    
    for (int i= 0; i< ca.cells.length; i++)
    {
      if (cells[i] ==1) 
      {
          fill (255);        
      }
      else {fill(0);}
      noStroke(); 
      if (is2D) {cellPosY = changeable;} else {cellPosY = 300;}
      rect(i*cellWidth, cellPosY, cellWidth, cellLength);
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
