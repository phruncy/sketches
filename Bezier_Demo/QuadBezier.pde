class QuadBezier extends Bezier
{
  
  /**
   * Constructs a quadric bezier curve from individual coordinates
   * @param p0X The x-coordinate of the first anchor point
   * @param p0Y The y-coordinate of the first anchor point
   * @param p1X The x-coordinate of the first control point
   * @param p1Y The y-coordinate of the first control point
   * @param p2X The x-coordinate of the second control point
   * @param p2Y The y-coordinate of the second control point
   */
  public QuadBezier(float p0X, float p0Y, float p1X, float p1Y, float p2X, float p2Y) 
  {
    super(new PVector[] {
      new PVector(p0X, p0Y),
      new PVector(p1X, p1Y),
      new PVector(p2X, p2Y)
    });
  }
  
  /**
   * Constructs a quadric bezier curve from Vectors
   * @param p0 The first anchor point
   * @param p1 The control point
   * @param p2 The second anchor point
   */
  public QuadBezier(PVector p0, PVector p1, PVector p2)
  {
    super(new PVector[] { p0, p1, p2 });
  }
  
  /**
   * @override
   */
  public PVector point(float t) 
  {
    float tSq = sq(t);
    float x = (1 - tSq)*_points[0].x + 2*(1 - t)*t*_points[1].x + tSq*_points[2].x;
    float y = (1 - tSq)*_points[0].y + 2*(1 - t)*t*_points[1].y + tSq*_points[2].y;
    return new PVector(x, y);
  }
  
  /*
   * draws the curve on screen
   **/
  // Processing has no Quadric Bezier drawing function, so this function just uses a 'degenerated' cubic curve 
  public void draw(color c, float lineWeight) 
  {
    push();
    noFill();
    stroke(c);
    strokeWeight(lineWeight);
    bezier(_points[0].x, _points[0].y, _points[1].x, _points[1].y, _points[1].x, _points[1].y, _points[2].x, _points[2].y);
    pop();
  }
  
  /**
   * @override
   */
  public void drawDebug(float t) 
  {
    // first interpolation
    float x1 = lerp(_points[0].x, _points[1].x, t);
    float y1 = lerp(_points[0].y, _points[1].y, t);
    float x2 = lerp(_points[1].x, _points[2].x, t);
    float y2 = lerp(_points[1].y, _points[2].y, t);
    stroke(0, 200, 0);
    line(x1, y1, x2, y2);
    stroke(255, 0, 255);
    line(x1, y1, x2, y2);
    // second interpolation
    float x3 = lerp(x1, x2, t);
    float y3 = lerp(y1, y2, t);
    fill (255, 0, 255);
    circle(x3, y3, 10);
  }
}
