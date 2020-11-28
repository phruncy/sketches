

CellularAutomaton ca;
int ruleNumber =30; // hier regelnummer eingeben
int[] ruleset = new int[8];
boolean is2D;
int cellPosY;



void setup() 
{  
  size(1080,720);
  background(0);
  is2D = true;
  convertRule (ruleNumber);
  ca = new CellularAutomaton(ruleset);
  cellPosY = ca.generationCount*ca.cellWidth;
}

void draw ()
{
  ca.render();//render the current generation
  ca.generate();//calculate the next generation
}

void mousePressed ()
{
  background(0);
  ca.clearAll();
}

void keyPressed()
{
  background (0);
  ca.clearAll();
  is2D = !is2D;
  changeMode();
}

//wandelt die eingegebene dezimalzahl in ein binär befülltes Array um
void convertRule (int rulenumber) 
{
  int modulo = rulenumber;
  for (int n= 0; n<ruleset.length; n++)
  {
    ruleset [n] = modulo % 2;
    modulo = modulo/2;
  }
}

void changeMode () 
{
  if (is2D)
  {
    ca.cellLength = ca.cellWidth;    
  }
  else
  {
    ca.cellLength = ca.cellWidth;    
  }
}

class CellularAutomaton 
{
  int[] cells; //Platzhalter für 1D-Zellenstreifen
  int generationCount;
  int cellLength;
  int cellWidth;
  int changeable;
  
  
  int[] rules; //REgelset wird hier aufbewahrt
  
  //Konstruktor
  CellularAutomaton (int[] rules)
  {
    this.rules = rules;
    this.cellWidth = 4;
    this.cellLength = /*50;*/ this.cellWidth;
    this.cells = new int [width/cellWidth];// länge des Arrays
    clearAll();  
  }
  
  void setRules (int[] carryR)
  {
    this.rules = carryR;
  }
  
  void clearAll()//bereinigt das Feld
  {
    for (int i=0; i<cells.length; i++) 
    {
      cells[i]=0;
    }    
    initialiseCell();  
    generationCount = 0;
    
  }
  
  void initialiseCell() 
  {
    cells [cells.length/2]= 1;
  }
  
  int executeRules(int l, int m, int r) 
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
  
  
  void generate () 
  {
    int [] nextGeneration = new int [cells.length];
    for (int i = 1; i< cells.length -1; i++) // lässt die Zellen am Rand aus
    {
      int left = cells[i-1];
      int thisCell = cells[i];
      int right = cells[i+1];
      
      nextGeneration [i]= executeRules(left, thisCell, right); //die neue generation an der Stelle i wird aus der alten berechnet   
     
    }   
    cells = (int[]) nextGeneration.clone();//die nächte generation wird zur aktuellen Generation
    generationCount ++;
    changeable = generationCount*cellWidth;
  }
  
  void render ()
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
