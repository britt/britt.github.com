import React, {Component, PureComponent} from 'react'
import Helmet from 'react-helmet'

function configureCanvas (canvas, w, h) {
  const context = canvas.getContext('2d')
  const {devicePixelRatio} = window

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

function circle (ctx, x, y, r, color = '#000') {
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, Math.PI * 2, 0)
  ctx.closePath()
  ctx.stroke()
}

class StoryBeat {
  constructor (name, x, y, r) {
    this.name = name
    this.x = x
    this.y = y
    this.r = r
  }

  draw (ctx, width, height) {
    const {x, y, r} = this
    circle(ctx, x, y, r)
    ctx.font = 'Montserrat, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(this.name, x, y - r * 1.3)
  }
}

const defaultFreytag = {
  exp: 0.1,
  crux: 0.7,
  epi: 0.1,
  beats: [],
  padding: 0.05,
  offsetX: 0,
  offsetY: 0.125,
  peak: 0.5
}

// TODO: add boundaries
class Freytag {
  constructor (props) {
    let merged = {...props, ...defaultFreytag}
    this.exp = merged.exp
    this.epi = merged.epi
    this.crux = merged.crux
    this.peak = merged.peak
    this.padding = merged.padding
    this.offsetX = merged.offsetX
    this.offsetY = merged.offsetY
    this.beats = merged.beats
  }

  // TODO: implement me
  addBeat (name, pos, r) {
    let [x, y] = [0, 0]
    this.beats.push(new StoryBeat(name, x, y, r))
  }

  draw (ctx, width, height) {
    const left = this.offsetX * width + width * this.padding
    const right = width * (1 - this.padding)
    const top = height - this.offsetY * width - this.peak * height
    const bottom = height - this.offsetY * width
    const endExposition = left + Math.round(width * this.exp)
    const beginEpilogue = right - Math.round(width * this.epi)
    const climax = left + Math.round(width * this.crux)

    line(ctx, left, bottom, endExposition, bottom)
    line(ctx, endExposition, bottom, climax, top)
    line(ctx, climax, top, beginEpilogue, bottom)
    line(ctx, beginEpilogue, bottom, right, bottom)

    this.beats.push(new StoryBeat('Hook', endExposition, bottom, 10))
    this.beats.push(new StoryBeat('Climax', climax, top, 10))
    this.beats.push(new StoryBeat('Denouement', beginEpilogue, bottom, 10))

    this.beats.forEach(b => b.draw(ctx, width, height))

    return true
  }
}

class Canvas extends PureComponent {
  render () {
    let {width, height} = this.props

    return <canvas ref={(c) => {
      if (!c) {
        return
      }
      const ctx = configureCanvas(c, width, height)
      let drawings = this.props.drawings || []
      drawings.forEach(d => d.draw(ctx, width, height))
    }} />
  }
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
          <h3>Freytag Triangle</h3>
          <Canvas
            width={640}
            height={400}
            drawings={[
              new Freytag({
                exp: 0.15
              })
            ]}
          />
        </section>
      </main>
    )
  }
}
