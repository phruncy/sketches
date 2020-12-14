/*
 * Scared goat: example solution without PVector 
 * @author Tim Laue
 **/

float circleRadius = 170;
float goatRadius = 10;

void setup()
{
  size(500,500);
}

void draw()
{
  background(200);
  ellipseMode(RADIUS);
  // screen center
  float centerX = width/2;
  float centerY = height/2;
  
  // draw large circle
  fill(255);
  ellipse(centerX, centerY, circleRadius, circleRadius);
  
  /// GOAT POSITION ///
  // step 1: get x and y components of distance from center to mouse
  float vecToCenterX = centerX - mouseX; // how many pixels from 
  float vecToCenterY = centerY - mouseY;
  // the same as dist(centerX, centerY, mouseX, mouseY)
  float distToCenter = mag(vecToCenterX, vecToCenterY);
  
  // step 2: normalize x and y components and multiply them by the circle Radius
  // so that the goat stays always at the cricle border
  // then add them to centerX/centerY
  float goatX = centerX + (vecToCenterX / distToCenter) * (circleRadius - goatRadius);
  float goatY = centerY + (vecToCenterY / distToCenter) * (circleRadius - goatRadius);
  
  // draw the goat
  fill(255,0,0);
  ellipse(goatX, goatY, goatRadius, goatRadius);
} {}
