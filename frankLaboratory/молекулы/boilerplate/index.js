const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

ctx.fillStyle = 'darkred' // to make shure that the shapes we draw are visible against the black background (it is set to black by default)

class Particle {
  constructor(effect) {   // every particle will expect a reference pointing to the main effect object. We are not creating copies of the effect, 
    this.effect = effect   //just pointing to that sane effect class from multiple places 
    this.radius = Math.random() * 40 + 5
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2) // расчеты, чтобы круги были видны полностью и не разрывались экраном по краям
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
    this.vx = Math.random() * 4 - 2 // velocity  
    this.vy = Math.random() * 4 - 2 // velocity  
  }

  draw(context) { // defines what each particle looks like
    ctx.fillStyle = `hsl(${this.x * 0.5}, 100%, 50%)`
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
    context.stroke()
  }

  update() {
    this.x += this.vx
    if (this.x > this.effect.width - this.radius || this.x < this.radius) {
      this.vx *= -1
    }

    this.y += this.vy
    if (this.y > this.effect.height - this.radius || this.y < this.radius) {
      this.vy *= -1
    }
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 200
    this.createParticles()
  }

  createParticles() { // methods initialises the effect
    for (let i = 0; i < this.numberOfParticles; i ++) {
      this.particles.push(new Particle(this))
    }
  }

  handleParticles(context) {
    this.particles.forEach((particle) => {
      particle.draw(context)
      particle.update()
    })
  }
}

const effect = new Effect(canvas)

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  effect.handleParticles(ctx)
  requestAnimationFrame(animate)
}
animate()