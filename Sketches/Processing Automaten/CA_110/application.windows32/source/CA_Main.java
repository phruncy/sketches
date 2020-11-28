import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import ddf.minim.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class CA_Main extends PApplet {


Minim minim;
AudioPlayer player, player2;//erstellt einen Player für ein einziges Lied. Neues Lied, neuer Player (player2)
 
  Automaton cellularAutomaton;
  //Settings
  //hier Automatenregel eingeben (vorläufig!)
  int ruleNumber = 110;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 4;
  int visualCellWidth = 4;
  
  public void setup()
  {
    
    background (0);
    cellularAutomaton = new Automaton (ruleNumber, visualCellWidth, visualCellLength );
    cellularAutomaton.initialise();
    
    minim = new Minim(this);
    player = minim.loadFile("Jazz.mp3");//importiert mp3 und weist es dem player zu
    player2 = minim.loadFile("ohyeah.mp3");
    player.play(); //befehl zum abspielen
    player.loop();//Wiederholt das lied immer wieder
  }
  public void draw ()
  {
    cellularAutomaton.run();   
  }
  
  public void mousePressed()
  {
    cellularAutomaton.clearAll();
    player2.rewind();
    player2.play();
  }
  
 
class Automaton
{
  private int caRuleNumber; 
  private int [] ruleset = new int[8];
  private int generationCount;
  //Visuals
  private int cellWidth;//wird von eingabe im Main-Programm geliefert
  private int cellHeight;// ''
  private int rectPositionY; 
  private int fadingAmount = 10; //Verblassungsgrad für alternde Zellen
  
  
  
  //Zell-Array
  private Cell [] cell; 
  
  //Konstruktor
  public Automaton (int rule, int cellwidth, int celllength)
  {
    this.caRuleNumber = rule;
    this.cellWidth = cellwidth;
    this.cellHeight = celllength;
    this.generationCount= 0;
  }
  
  
  public void clearAll()//bereinigt das Feld
  {
    for (int i=0; i<cell.length; i++) 
    {
      cell[i].state =0;
    }    
    background(0);
    initialiseCell();  
    generationCount = 0;    
  }
  
  
  //initialisiert die Zellen
  public void initialise ()
  {
    convertRule(caRuleNumber);
    cell = new Cell [width/cellHeight];
    //füllt Array mit neuen Zellen
    for (int i= 0; i< cell.length; i++)
    {
      cell[i]= new Cell (0);
      cell[i].position = i;
      //die Nachbarn der jeweils vorher initialisierten Zelle werden bestimmt (nicht für Zellen an den Rändern)
      if (i>1 && i<cell.length) 
      {
        cell[i-1].setNeighbours();
      }  
    }
    clearAll();
  }
  
    //Vorläufig!!!!!!!! legt den Startwert fest
  public void initialiseCell() 
  {
    cell [cell.length/2].state= 1;
  }
  
  
  
  
  //konvertiert die Regelnummer in ein int-Array
  public void convertRule (int rulenumber) 
  {
    int modulo = rulenumber;
    for (int n= 0; n<ruleset.length; n++)
    {
      ruleset [n] = modulo % 2;
      modulo = modulo/2;
    }
  }
  
  //berechnet die grafische Ausgabe aus dem Zustand der Zellen
  public void render ()
  {
    for (int i=0; i<cell.length; i++)
    {
      if (cell[i].state == 1)
      {
        fill(255 - (cell[i].age * fadingAmount)); //ältere Zellen werden weniger hell dargestellt
      }
      else 
      {
        fill (0);
      }
      noStroke();
      rectPositionY = generationCount*cellHeight;//Y-Position muss jedes mal neu berechnet werden!
      rect (i*cellWidth, rectPositionY, cellWidth, cellHeight);
    }
  }
  
  
  
  /*
  Run():
  1. Aktuelle Generation wird gerendert
  2. Jede Zelle Berechnet Ihren neuen Zustand
  3. GenerationCount geht 1 nach oben
  
  */
  public void run ()
  {
    if (generationCount < height)
    {
      render();
      for (int i=1; i<cell.length-1; i++)//lässt die Zellen am Rand aus und erzeugt eine statische "Wand" aus toten Zellen;
      {
        cell[i].generateState();
      }
      generationCount++; 
      println(rectPositionY);
    }
  }
}
class Cell
{
  private int state;
  private int formerState;
  private int age;
  private int position;
  private Cell leftNeighbour;
  private Cell rightNeighbour;
  
  public Cell (int initialState)
  {
    this.state = initialState;
    this.formerState = 0;
    this.age = 0;
  }
  
  public void setNeighbours ()
  {
    this.leftNeighbour = cellularAutomaton.cell[this.position-1];
    this.rightNeighbour = cellularAutomaton.cell[this.position+1];
  }
  
  //führt die Regeln aus
  public int executeRules (int l, int m, int r)
  {
    
    if (l==1 && m == 1 && r==1) {return cellularAutomaton.ruleset [7];}
    if (l==1 && m == 1 && r==0) {return cellularAutomaton.ruleset [6];}
    if (l==1 && m ==0 && r== 1) {return cellularAutomaton.ruleset [5];}
    if (l==1 && m ==0 && r== 0) {return cellularAutomaton.ruleset [4];}
    if (l==0 && m ==1 && r== 1) {return cellularAutomaton.ruleset [3];}
    if (l==0 && m ==1 && r== 0) {return cellularAutomaton.ruleset [2];}
    if (l==0 && m ==0 && r== 1) {return cellularAutomaton.ruleset [1];}
    if (l==0 && m ==0 && r== 0) {return cellularAutomaton.ruleset [0];}   
    else {return 0;} 
    
    //lalala
   
    //Regeln hier einfügen
    
  }
  
  //berechnet den neuen Zellzustand
  //wenn eine Zelle 1 ist und ihren Zustand beibehält: Alter um 1 erhöhen. 
  public void generateState ()
  {
    this.formerState = this.state;
    this.state = executeRules(leftNeighbour.formerState, this.state, rightNeighbour.state );
    if (this.state == 1 && this.state==this.formerState )
    {
      age++;
    }
    else
    {
      age = 0;
    }
  }
  
  
}
  public void settings() {  size(1280, 720); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "CA_Main" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
