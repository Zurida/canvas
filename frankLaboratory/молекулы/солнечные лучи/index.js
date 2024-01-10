// https://www.youtube.com/watch?v=PoDjjHh931c&list=PLYElE_rzEw_tLmWtIkUfI6Odi38ajFI8R

const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
gradient.addColorStop(0, 'white')
gradient.addColorStop(1, 'gold')
ctx.fillStyle = gradient // to make shure that the shapes we draw are visible against the black background (it is set to black by default)
ctx.strokeStyle = gradient

class Particle {
  constructor(effect, index) {   // every particle will expect a reference pointing to the main effect object. We are not creating copies of the effect, 
    this.effect = effect   //just pointing to that sane effect class from multiple places 
    this.index = index
    this.radius = Math.floor(Math.random() * 10 + 1) // Math.floor is good for performance reasons since for js it's easier to work with integers
    if (this.index % 100 === 0) {
      this.radius = Math.floor(Math.random() * 10 + 30)
    }
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2) // расчеты, чтобы круги были видны полностью и не разрывались экраном по краям
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
    this.vx = Math.random() * 1 - .5 // first force influencing particle motion: bounce
    this.vy = Math.random() * 1 - .5 //   
    this.pushX = 0 // second force influencing particle motion: push force
    this.pushY = 0
    this.friction = 0.8 // force that works in the direction opposite to the direction in which the object is trying to move  and gradually slows the moving objet down
  }                      // this property can be set in Effect class if we want all particles to be a subject to the same friction force. But in this class we can gie each particle a different friction value  

  draw(context) { // defines what each particle looks like
    if (this.index % 2 === 0) {
      context.save()
      context.globalAlpha = 0.4
      context.beginPath()
      context.moveTo(this.x, this.y)
      context.lineTo(this.effect.mouse.x, this.effect.mouse.y)
      context.stroke()
      context.restore()
    }
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }

  update() {
    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x
      const dy = this.y - this.effect.mouse.y
      const distance = Math.hypot(dx, dy)
      const force = this.effect.mouse.radius / distance // The ratio between max distance mouse radius and the current distance; used to move fast then particle close to the mouse and slower as they reach the edge of mouse radius

      if (distance < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx)
        // this.x += Math.cos(angle)
        // this.y += Math.sin(angle)
        this.pushX += Math.cos(angle) * force
        this.pushY += Math.sin(angle) * force
      }
    }

    // Adding physics with friction
    this.x += (this.pushX *= this.friction) + this.vx // particles move fast but for each animation frame the force of push will be diminishing 
                                                      // until it reaches a value close to zero. At that point the bounce in motion will be stronger and it will take over
    this.y += (this.pushY *= this.friction) + this.vy // i.e. multiplying to 0.95 reduces the push force by 5% for each animation frame  

    // makes particels bounce from the edge of canvas
    // this.x += this.vx
    // if (this.x > this.effect.width - this.radius || this.x < this.radius) {
    //   this.vx *= -1
    // }

    // this.y += this.vy
    // if (this.y > this.effect.height - this.radius || this.y < this.radius) {
    //   this.vy *= -1
    // }

    if (this.x < this.radius) {
      this.x = this.radius
      this.vx *= -1
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius
      this.vx *= -1
    }

    if (this.y < this.radius) {
      this.y = this.radius
      this.vy *= -1
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.width - this.radius
      this.vy *= -1
    }

    // this.x += this.vx
    // this.y += this.vy

    
  }

  reset() {
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2) // расчеты, чтобы круги были видны полностью и не разрывались экраном по краям
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2) 
  }
}

class Effect {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.particles = []
    this.numberOfParticles = 200
    this.createParticles()

    this.mouse = {
      x: this.width * 0.5, 
      y: this.height * 0.5,
      pressed: false,
      radius: 120
    }

    window.addEventListener('resize', e => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
    })

    window.addEventListener('mousemove', e => {
      if (this.mouse.pressed)
        this.mouse.x = e.x
        this.mouse.y = e.y
    })

    window.addEventListener('mousedown', e => {
      this.mouse.pressed = true
      this.mouse.x = e.x
      this.mouse.y = e.y
    })

    window.addEventListener('mouseup', e => {
      this.mouse.pressed = false
    })
  }

  createParticles() { // methods initialises the effect
    for (let i = 0; i < this.numberOfParticles; i ++) {
      this.particles.push(new Particle(this, i))
    }
  }

  handleParticles(context) {
    this.connectParticles(context)
    this.particles.forEach((particle) => {
      particle.draw(context)
      particle.update()
    })
  }

  connectParticles(context) { // helps to connect particles that are close enough for determined distance with lines
    const maxDistance = 100
    for (let a = 0; a < this.particles.length; a++) {  // we compare every particle against every other particle in the same array using nested for loops
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x
        const dy = this.particles[a].y - this.particles[b].y
        const distance = Math.hypot(dx, dy)

        if (distance < maxDistance) {
          context.save() // save all canvas settings, all changes will affect only this current shape
          const opacity = 1 - (distance/maxDistance)
          context.globalAlpha = opacity
          context.beginPath()
          context.moveTo(this.particles[a].x, this.particles[a].y)
          context.lineTo(this.particles[b].x, this.particles[b].y)
          context.stroke()
          context.restore() // than we restore canvas back to what it was at the point of save. So we are returning global alpha back to its default value 
        }
      }
    }
  }

  resize(width, height) { // canvas state always sets to default when canvas is resized which includes fillStyle and strokeStyle reset into the default black color
    this.canvas.width = width
    this.canvas.height = height
    this.width = width
    this.height = height
    const gradient = this.context.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(0.5, 'darkcyan')
    gradient.addColorStop(1, 'yellow')
    this.context.fillStyle = gradient // to make shure that the shapes we draw are visible against the black background (it is set to black by default)
    this.context.strokeStyle = 'white'

    this.particles.forEach((particle) => {
      particle.reset()
    })
  }
}

const effect = new Effect(canvas, ctx)

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  effect.handleParticles(ctx)
  requestAnimationFrame(animate)
}
animate()