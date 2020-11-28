public class Line
{
  private Vertex _v1;
  private Vertex _v2;
  private PVector d;
  
  public Line(Vertex v1, Vertex v2) 
  {
    /**
     * the start of the line
     */
    _v1 = v1;
    /**
     * the end of the line
     */
    _v2 = v2;
    /**
     * directional Vector (not normalized)
     */
    d = PVector.sub(v2.position(), v1.position());
  }
  
  /** actually: is the distance of the point 'close enough'?
   * This function doesn't actually check if the point is on the line
   */
  public boolean intersectPoint(PVector pIn, float tolerance)
  {
    // get the parameter t on the line for the projection of pIn on the line:
    // t is the dotProduct of the vectors pIn - v_1 
    // division by the length of the line normalizes t
    float t = ((pIn.x - _v1.x()) * (_v2.x() - _v1.x()) + (pIn.y - _v1.y()) * (_v2.y() - _v1.y()))/ d.magSq();
    // check if intersection point is in between p1 and p2
    // this is the case when t is between 0 and 1
    if (t < 0 || t > 1) {return false;}
    
    // local vector of the intersection
    PVector intersect = PVector.add(_v1.position(), PVector.mult(d, t));
    // get the actual distance (squared) with pythagoras
    float distanceSq = (intersect.x - pIn.x) * (intersect.x - pIn.x) + (intersect.y - pIn.y)* (intersect.y - pIn.y);
    // check if distance is below tolerance value
    if (distanceSq < tolerance * tolerance) {
      return true;
    }
    return false;
  }
  
  public float length()
  { return d.mag(); }
  
  void draw()
  {
    line(_v1.x(), _v1.y(), _v2.x(), _v2.y());
  }
}
