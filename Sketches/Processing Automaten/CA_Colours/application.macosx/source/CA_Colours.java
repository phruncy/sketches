import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import interfascia.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class CA_Colours extends PApplet {


 
 //GUI Elemnte
 GUIController c;
 IFTextField t;
 
 Automaton cellularAutomaton;
  
  //Größe, in der die Zellen dargestellt werden
  int visualCellLength = 500;
  int visualCellWidth = 500;
  
  public void setup()
  {
    
    background (0);
    
    c= new GUIController(this);
    t = new IFTextField("Text Field", 25, 30, 150);
    
    c.add(t);
    t.addActionListener(this);
    
    cellularAutomaton = new Automaton (0, visualCellWidth, visualCellLength );
    cellularAutomaton.initialise();
    
    
  }
  public void draw ()
  {
    cellularAutomaton.run();   ; 
      
  }
  
  //Eingabe der Regel in das GUI ändert die Regel im Automaten und startet ihn neu
  public void actionPerformed(GUIEvent e) 
  {
    if (e.getMessage().equals("Completed")) 
    {
      cellularAutomaton.caRuleNumber = PApplet.parseInt(t.getValue());
      cellularAutomaton.clearAll();
    }
  }
  
  public void mousePressed()
  {
    cellularAutomaton.clearAll();
    
  }
  
class Automaton
{
  private int caRuleNumber; 
  private int [] ruleset = new int[8];
  private int generationCount;
  //Visuals
  private int cellWidth;//wird von eingabe im Main-Programm geliefert
  private int cellHeight;

  
  
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
    convertRule(caRuleNumber);
    for (int i=0; i<cell.length; i++) 
    {
      cell[i].state =0;
    }    
    background(255);
    initialiseCell();  
    generationCount = 0;    
  }  
  
  //initialisiert die Zellen
  //Array Länge: (Fenstergröße - rand an beiden Seiten) : (Zellgröße + Zellabstand)
  public void initialise ()
  {
    convertRule(caRuleNumber);
    cell = new Cell [24];
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
    int r;
    int g;
    int b;
    background (255);
    for (int i=0; i<cell.length; i++)
    {
      
      r = unbinary(calculateR());
      g = unbinary(calculateG());
      b = unbinary(calculateB());
      noStroke();
      fill (r,g,b);
      rect(width/2 - cellWidth/2, height/2 - cellWidth/2, cellWidth, cellWidth);
    }
  }

  public String calculateR ()
  {
    String r = "";
    for (int i = 0; i<7; i++)
    {
      r = r+ cell[i].state;
    }
    return r;
  }
  
  public String calculateG ()
  {
    String g = "";
    for (int i = 8; i<15; i++)
    {
      g = g+ cell[i].state;
    }
    return g;
  }
  
  public String calculateB ()
  {
    String b = "";
    for (int i = 16; i<cell.length; i++)
    {
      b = b+ cell[i].state;
    }
    return b;
  }
  
  
  
  public void run ()
  {
      render();
     
        for (int i=1; i<cell.length-1; i++)//lässt die Zellen am Rand aus und erzeugt eine statische "Wand" aus toten Zellen;
        {
          {
            cell[i].generateState();
          }
        }
        generationCount++; 
        delay (100);
      //}    
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
    String[] appletArgs = new String[] { "CA_Colours" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
