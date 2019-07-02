import React, {Component} from 'react'
import Helmet from 'react-helmet'

function configureCanvas (canvas, w, h) {
  const context = canvas.getContext('2d')
  const {devicePixelRatio} = window

  console.log(devicePixelRatio)
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  canvas.width = w * devicePixelRatio
  canvas.height = h * devicePixelRatio
  context.scale(devicePixelRatio, devicePixelRatio)

  context.lineCap = 'square'
  context.lineWidth = 1
  context.fillStyle = '#000'
  context.strokeStyle = '#000'

  return context
}

function line (ctx, startX, startY, endX, endY, color = '#000') {
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.closePath()
  ctx.stroke()
}

class StoryBeat {
  constructor (label, radius, x, y) {
    this.label = label
    this.radius = radius
    this.x = x
    this.y = y
  }
}

// TODO: add circles at key points
// TODO: Convert to component?
class Freytag {
  constructor (exp, crux, epi) {
    this.exp = exp
    this.crux = crux
    this.epi = epi
  }

  draw (ctx, width, height, offset = {x: 0, y: 0}) {
    const left = offset.x
    const right = offset.x + width
    const top = offset.y
    const bottom = offset.y + height
    const endExposition = left + Math.round(width * this.exp)
    const beginEpilogue = right - Math.round(width * this.epi)
    const climax = left + Math.round(width * this.crux)

    line(ctx, left, bottom, endExposition, bottom)
    line(ctx, endExposition, bottom, climax, top)
    line(ctx, climax, top, beginEpilogue, bottom)
    line(ctx, beginEpilogue, bottom, right, bottom)
    return true
  }
}
// TODO: convert to component
function freytag (canvas, w, h, exp = 0.2, crux = 0.7, epi = 0.2, padding = 0.05) {
  const ctx = configureCanvas(canvas, w, h)
  const f = new Freytag(exp, crux, epi)
  f.draw(ctx, w - Math.round(w * 2 * padding), 200, {x: Math.round(w * padding), y: Math.round(h - 200 - h * padding)})
}

function Canvas ({width, height, draw}) {
  return <canvas ref={(c) => draw(c, width, height)} />
}

export default class Plots extends Component {
  render () {
    return (
      <main className='container'>
        <Helmet title='Plots - mutated plot diagrams'>
          <style>
            {'canvas {box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);}'}
          </style>

        </Helmet>
        <section>
          <h2>Plots</h2>
        </section>
        <section>
          <Canvas width={640} height={400} draw={freytag} />
        </section>
      </main>
    )
  }
}
