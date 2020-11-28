//source: The Coding Train.Coding Challenge #47: Pixel Sorting in processing
//https://www.youtube.com/watch?v=JUDYkxU6J0o&t=229s

PImage img; //Klassenvariable "Bild"
PImage sortedImg; //sortiertes Bild


void setup () 
  {
  size (714, 1000);
  img = loadImage("compressed.jpg"); //Bild aus "data" laden
  img.loadPixels();
  sortedImg = createImage (img.width, img.height, RGB);
  
  
  //das erzeugte Bild mit den Pixeln des andern füllen:
  /*for (int i= 0; i< sortedRed.pixels.length; i++)
  {
    sortedRed.pixels[i]= red.pixels[i]; 
  }*/
  sortedImg = img.get(); //kopiert red in sortedRed
  updatePixels();// wendet die Änderung auf das Bild an;
  
  //Implementierung selection sort
  //äußere Schleife führt die innere Schleife für jedes Element im Array aus
  for (int i =0; i< sortedImg.pixels.length; i++)      
    {
      float record = -0.1;
      int selectedPixel = i; //speichert das ausgewählte pixel
      //innere Schleife wird nur ab dem jeweils ausgewählten Pixel ausgeführt!
      //ermittelt das jeweils hellste Pixel
      for (int n= i; n< sortedImg.pixels.length; n++)
      {        
        //ermittelt die Helligkeit des jeweiligen Pixels
        color pixelColor = sortedImg.pixels[n];
        float brightn = hue(pixelColor);
        if (brightn > record) 
        {
          selectedPixel = n;
          record = brightn; //helligkeit des ausgewählten Pixels wird als hellstes vermerkt
        }
      }
      
      //das ermittelte hellste Pixel wird mit i getauscht
      color carryPix = sortedImg.pixels[i]; //speichert den inhalt von i
      sortedImg.pixels[i]= sortedImg.pixels[selectedPixel]; // Wert des hellsten pixels wird in i gesetzt
      sortedImg.pixels[selectedPixel] = carryPix;// 
    }
  }
void draw ()
{
  //image (img, 0,0); //zeigt das Bild an
  image (sortedImg, 0, 0);
}

  
