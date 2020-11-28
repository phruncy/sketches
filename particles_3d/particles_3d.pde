ArrayList<Particle> particles;
ArrayList<Integer> deletables;
float radius = 20;
PVector origin;
PVector gravity;
private int particlesPerSecond = 1;
private float timeBetweenParticles = (1.0 / particlesPerSecond) * 1000;
private float timeSinceLastParticle = 0, lastParticleSpawn = 0;

void setup() {
  size(800, 500, P3D);
  
  noStroke();
  particles = new ArrayList<Particle>();
  deletables = new ArrayList<Integer>();
  origin = new PVector(width / 2, 50, 0);
  gravity = new PVector(0, 5, 0);
  println(timeBetweenParticles);
}

void draw() {
  updateParticles();
  // clear expired particles
  for (Integer i: deletables) {
    particles.remove(i.intValue());
  }
  deletables.clear();
  // display logic
  display();
}

void updateParticles() 
{
  // check for new Particles
  timeSinceLastParticle = millis() - lastParticleSpawn;
  println(timeSinceLastParticle);
  if (timeSinceLastParticle > timeBetweenParticles) {
    Particle particle = new Particle (new PVector(0, 0, 0), random(5, 10), randomVelocity(), random(2000, 2500));
    particles.add(particle);
    PVector target = new PVector(mouseX, mouseY).sub(origin);
    target.mult(-0.3);
    particle.applyForce(target);
    lastParticleSpawn = millis();
  }
  int index = 0;
  // update particles
  for (Particle p: particles) {
    p.applyForce(gravity);
    p.update();
    if (p.hasExpired()) {
      deletables.add(index);
    }
  }
}

void display() 
{
  PVector target = new PVector(mouseX, mouseY).sub(origin);
  target.mult(0.1);
  origin.add(target);
  background(100);
  lights();
  pushMatrix();
  translate(origin.x, origin.y, origin.z);
  fill(0);
  box(20);
  
  for (Particle p: particles) {
    p.display();
  }
  popMatrix();
  
  fill(255);
  text(frameRate, 50, 50);
}

PVector randomVelocity() 
{
  return new PVector(random(-50, 50), random(-100, 0), random(-50, 50));
}
