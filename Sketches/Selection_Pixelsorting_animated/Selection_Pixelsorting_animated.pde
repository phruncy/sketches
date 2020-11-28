//source: The Coding Train.Coding Challenge #47: Pixel Sorting in processing
//https://www.youtube.com/watch?v=JUDYkxU6J0o&t=229s

PImage img; //Klassenvariable "Bild"
PImage sortedImg; //sortiertes Bild
int index = 0;


void setup () 
  {
  size (1280, 853);
  img = loadImage("images.jpeg"); //Bild aus "data" laden
  img.loadPixels();
  sortedImg = createImage (img.width, img.height, RGB);
  
  
  //das erzeugte Bild mit den Pixeln des andern füllen:
  /*for (int i= 0; i< sortedRed.pixels.length; i++)
  {
    sortedRed.pixels[i]= red.pixels[i]; 
  }*/
  sortedImg = img.get(); //kopiert red in sortedRed
  
  
  }
void draw ()
{
  
 // die draw funktion updatet ein Pixel per durchlauf:
 
  
     float record = -0.1;
     int selectedPixel = index; //speichert das ausgewählte pixel
     //innere Schleife wird nur ab dem jeweils ausgewählten Pixel ausgeführt!
     //ermittelt das jeweils hellste Pixel
     for (int n= index; n< sortedImg.pixels.length; n++)
     {        
       //ermittelt die Helligkeit des jeweiligen Pixels
        color pixelColor = sortedImg.pixels[n];
        float brightn = red(pixelColor);
        if (brightn > record) 
        {
          selectedPixel = n;
          record = brightn; //helligkeit des ausgewählten Pixels wird als hellstes vermerkt
        }
      }
      
      //das ermittelte hellste Pixel wird mit i getauscht
      color carryPix = sortedImg.pixels[index]; //speichert den inhalt von i
      sortedImg.pixels[index]= sortedImg.pixels[selectedPixel]; // Wert des hellsten pixels wird in i gesetzt
      sortedImg.pixels[selectedPixel] = carryPix;// 
      if (index < sortedImg.pixels.length-1) 
      {
        index++;
      }
      if (index == (sortedImg.pixels.length/4))
      {
        saveFrame();
      }
      
      else if (index == (sortedImg.pixels.length-1))
      {
        saveFrame();
      }
    
    sortedImg.updatePixels();// wendet die Änderung auf das Bild an;
  image (sortedImg, 0, 0);
}

  
