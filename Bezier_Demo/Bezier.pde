public abstract class Bezier
{
  protected PVector[] _points;
  public Bezier(PVector points[])
  {
    _points = points;
  }
  /**
   * Evaluates the curve equation for t and returns the curve point for t. For an explanaition of the
   * equation see: 
   * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curve
   * and https://vimeo.com/106757336
   */
  public abstract PVector point(float t);
  
  public abstract void draw(color c, float lineWeight);
  
  /**
   * draw the interpolation lines
   */
  public abstract void drawDebug(float t);
  
  /**
   * Draw anchor points and handlers
   */
  public void drawHandlers()  {
    push();
    for (int i = 0; i < _points.length; i++) {
      if (i > 0) {
        stroke(200, 100, 0);
        line(_points[i - 1].x, _points[i - 1].y, _points[i].x, _points[i].y);
      }
      noStroke();
      fill(0, 200, 200);
      circle(_points[i].x, _points[i].y, 15);
    }
    pop();
  }
}
