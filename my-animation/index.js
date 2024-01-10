const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

ctx.fillStyle = 'white' // to make shure that the shapes we draw are visible against the black background (it is set to black by default)
ctx.strokeStyle = 'darkgreen'
ctx.lineWidth = 1



class Wave {
  constructor(effect, waveIndex) {
    this.effect = effect 
    this.waveIndex = waveIndex
    this.radius = 20
    this.x = effect.width / 2
    this.y = effect.height / 2
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.stroke();
  }

  update() {
    this.radius += this.waveIndex
    
    if (this.radius > this.x / 2) {
      this.radius = this.waveIndex / 2
    }
  }

  reset() {

  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.waves = []
    this.wavesNumber = 4
    this.createWaves()
  }

  createWaves() {
    for (let i = 1; i < this.wavesNumber; i++) {
        this.waves.push(new Wave(this, i))
      }
  }

  handleWaves(context) {
    this.waves.forEach(wave => {
      wave.draw(context)
      wave.update(context)
    })
  }
}

let animationId
const effect = new Effect(canvas)


function animate() {
  animationId = requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  effect.handleWaves(ctx)
}

animate()


