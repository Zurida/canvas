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
    // Particles speed
    this.speedX = Math.random() * 5 - 2.5
    this.speedY = Math.random() * 5 - 2.5

    // Settings for lines after particles 
    this.history = [{x: this.x, y: this.y}] // 2) keep track of the position on particle each time the frame updates
    this.maxLength = Math.floor(Math.random() * 100)
    this.angle = 0
  }

  draw(context) {  // context specifies which canvas we want to draw on
    context.fillRect(this.x, this.y, 20, 20)

    context.beginPath() // 1) to draw lines after particle
    context.moveTo(this.history[0].x, this.history[0].y)  // 3) the start point of the line
    for (let i = 0; i < this.history.length; i++) {   // 4) runs as long as there are any more elements in history array
      context.lineTo(this.history[i].x, this.history[i].y)  // 5) start points of the line
    }
    context.stroke() // 6) actually draw the line on canvas
  }

  update() {
    this.angle += 0.5;

    // old values
    // this.x += this.speedX + Math.random() * 15 - 7.5 // 8) math.random makes lines wiggle
    // this.y += this.speedY + Math.random() * 15 - 7.5

    // valuse with sin and cos
    this.x += this.speedX + Math.sin(this.angle) * 10
    this.y += this.speedY +  Math.cos(this.angle) * 10


    this.history.push({x: this.x, y: this.y}) // 7) updates the history array
    if (this.history.length > this.maxLength) {
      this.history.shift() // removes one element from from the beginning of the array because we are adding new elements to the end with push - so shift removes the oldest segment
    }
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
      particle.update()
    })
  }
}

const effect = new Effect(canvas.width, canvas.height)
// effect.init()

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height) // to clear old paint between each frame and leave only the current position since generally previous positions are seen,   
  effect.render(ctx)
  requestAnimationFrame(animate)
}

animate()