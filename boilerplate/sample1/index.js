const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

ctx.fillStyle = 'white' // to make shure that the shapes we draw are visible against the black background (it is set to black by default)
ctx.strokeStyle = 'white'
ctx.lineWidth = 1


// ctx.lineCap = 'round'
// // if we have more than 1 shape we use ctx.beginPath()

// ctx.beginPath()
// ctx.moveTo(100, 200) // start coordinates of the line 
// ctx.lineTo(400, 500) // ending coordinates
// ctx.stroke()

class Particle {
  constructor(effect) {
    this.effect = effect
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
  }

  draw(context) {  // context specifies which canvas we want to draw on
    context.fillRect(this.x, this.y, 50, 50)
  }
}

class Effect {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.particles = []
    this.numberOfParticles = 50
    this.init() // we can call init method from inside the effect class constructor, because when we create an instance of 
                //a class using the new keyword constructor will run all the code inside line by line
                // so we can put here a behavior that we want to run when an instance of this class is created 
  }

  init() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this)) // this refers to the entire Effect class
    }
  }

  render(context) { // method that actually draws particle on canvas
    this.particles.forEach((particle) => {
      particle.draw(context)
    })
  }
}

const effect = new Effect(canvas.width, canvas.height)
// effect.init()
effect.render(ctx)

console.log(effect)