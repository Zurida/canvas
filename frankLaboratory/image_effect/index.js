const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')

canvas.width = 500
canvas.height = 700

class Cell {
    constructor(effect, x, y) {
      this.effect = effect
      this.x = x
      this.y = y
      this.width = this.effect.cellWidth
      this.height = this.effect.cellHeight
    }

    draw(context) {
      context.fillRect(this.x, this.y, this.width, this.height)
    }
    createGrid() {
      for (let y = 0; y < this.height; y+=this.cellHeight) {

      }
    }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.cellWidth = this.width / 35
    this.cellHeight = this.height / 55
    this.cell = new Cell(this, 0, 0)
    this.imageGrid = []

    
  }

  render(context) {
    this.cell.draw(context)
  }
}

const effect = new Effect(canvas) 
effect.render(ctx)
console.log(effect)