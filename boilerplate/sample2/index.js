const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

ctx.fillStyle = 'darkred' // to make shure that the shapes we draw are visible against the black background (it is set to black by default)


class Particle {
  constructor(effect) {   // every particle will expect a reference pointing to the main effect object. We are not creating copies of the effect, 
    this.effect = effect   //just pointing to that sane effect class from multiple places 
    this.x = Math.random() * effect.width
    this.y = Math.random() * effect.height
    this.radius = 15
  }

  draw(context) { // defines what each particle looks like
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }
  
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 20
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
    })
  }
}

const effect = new Effect(canvas)
effect.handleParticles(ctx)