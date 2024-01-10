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
    this.speedX
    this.speedY
    this.speedModifier = Math.floor(Math.random() * 5 + 1)
    // Settings for lines after particles 
    this.history = [{x: this.x, y: this.y}] // 2) keep track of the position on particle each time the frame updates
    this.maxLength = Math.floor(Math.random() * 200 + 10)
    this.angle = 0
    this.timer = this.maxLength * 2
  }

  draw(context) {  // context specifies which canvas we want to draw on

    context.beginPath() // 1) to draw lines after particle
    context.moveTo(this.history[0].x, this.history[0].y)  // 3) the start point of the line
    for (let i = 0; i < this.history.length; i++) {   // 4) runs as long as there are any more elements in history array
      context.lineTo(this.history[i].x, this.history[i].y)  // 5) start points of the line
    }
    context.stroke() // 6) actually draw the line on canvas
  }

  update() {
    this.timer --
    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize)
      let y = Math.floor(this.y / this.effect.cellSize)
      let index = y * this.effect.cols + x
      this.angle = this.effect.flowField[index]
      
      this.speedX = Math.cos(this.angle)
      this.speedY = Math.sin(this.angle)
      this.x += this.speedX * this.speedModifier
      this.y += this.speedY * this.speedModifier
  
  
      this.history.push({x: this.x, y: this.y}) // 7) updates the history array
      if (this.history.length > this.maxLength) {
        this.history.shift() // removes one element from from the beginning of the array because we are adding new elements to the end with push - so shift removes the oldest segment
      }
    } else if (this.history.length > 1) {
      this.history.shift()
    } else {
      this.reset()
    }
    
  }

  reset() {
    this.x = Math.floor(Math.random() * this.effect.width)
    this.y = Math.floor(Math.random() * this.effect.height)
    this.history = [{x: this.x, y: this.y}] 
    this.timer = this.maxLength * 2
  }
}

class Effect {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.particles = []
    this.numberOfParticles = 1000
    this.cellSize = 20
    this.rows
    this.cols
    this.flowField = []
    this.curve = 8
    this.zoom = 0.26 // 
    this.init() // we can call init method from inside the effect class constructor, because when we create an instance of 
                //a class using the new keyword constructor will run all the code inside line by line
                // so we can put here a behavior that we want to run when an instance of this class is created 
  }

  init() {
    // create flow field
    this.rows = Math.floor(this.height / this.cellSize)
    this.cols = Math.floor(this.width / this.cellSize)
    this.flowField = [] // in case init method is called while resizing canvas. That way all old values will be deleted and we can recalculate the new values
    
    for (let y = 0; y < this.rows; y++) { // we enter the row and and cycle throut the cells of this row and then move to the next row
      for (let x = 0; x < this.cols; x++) {
        let angle = Math.cos(x * this.zoom) + Math.sin(y * this.zoom) * this.curve
        this.flowField.push(angle);
      }
      console.log(this.flowField)
    }

    // create particles
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