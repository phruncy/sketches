public class CubicBezier extends Bezier
{
  /**
   * Constructs a cubic bezier curve from individual coordinates
   * @param p0X The x-coordinate of the first anchor point
   * @param p0Y The y-coordinate of the first anchor point
   * @param p1X The x-coordinate of the first control point
   * @param p1Y The y-coordinate of the first control point
   * @param p2X The x-coordinate of the second control point
   * @param p2Y The y-coordinate of the second control point
   * @param p3X The x-coordinate of the second anchor point
   * @param p3Y The y-coordinate of the second anchor point
   */
  public CubicBezier(float p0X, float p0Y, float p1X, float p1Y, float p2X, float p2Y, float p3X, float p3Y)
  {
    super(new PVector[] {
      new PVector(p0X, p0Y),
      new PVector(p1X, p1Y),
      new PVector(p2X, p2Y),
      new PVector(p3X, p3Y)
    });
  }
  
  /**
   * Constructs a bezier curve from Vectors
   * @param p0 The first anchor point
   * @param p1 The first control point
   * @param p2 The second control point
   * @param p3 The second anchor point
   */
  public CubicBezier(PVector p0, PVector p1, PVector p2, PVector p3) 
  {
    super(new PVector[] {
      p0, p1, p2, p3
    });
  }
  
  /**
   * @override
   */
  public PVector point(float t)
  {
    float x = pow((1-t), 3)*_points[0].x + 3*sq(1 - t)*t*_points[1].x + 3*(1 - t)*sq(t)*_points[2].x + pow(t, 3)*_points[3].x;
    float y = pow((1-t), 3)*_points[0].y + 3*sq(1 - t)*t*_points[1].y + 3*(1 - t)*sq(t)*_points[2].y + pow(t, 3)*_points[3].y;
    return new PVector(x, y);
  }
  
  /**
   * @override
   */
  public void draw(color c, float lineWeight) 
  {
    push();
    noFill();
    stroke(0);
    bezier(_points[0].x, _points[0].y, _points[1].x, _points[1].y, _points[2].x, _points[2].y, _points[3].x, _points[3].y);
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
    float x3 = lerp(_points[2].x, _points[3].x, t);
    float y3 = lerp(_points[2].y, _points[3].y, t);
    stroke(0, 200, 0);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    // second interpolation
    x1 = lerp(x1, x2, t);
    y1 = lerp(y1, y2, t);
    x2 = lerp(x2, x3, t);
    y2 = lerp(y2, y3, t);
    stroke(255, 0, 255);
    line(x1, y1, x2, y2);
    // third interpolation
    x3 = lerp(x1, x2, t);
    y3 = lerp(y1, y2, t);
    fill (255, 0, 255);
    circle(x3, y3, 10);
  }
}
