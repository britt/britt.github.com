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
  epi: 0.9,
  beats: [],
  padding: 0.05,
  offsetX: 0,
  offsetY: 0.125,
  peak: 0.5
}

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

  addBeat (name, pos, r, w, h) {
    let [x, y] = [
      w * this.xAtPos(pos),
      h * this.yAtPos(pos, w / h)]
    this.beats.push(new StoryBeat(name, x, y, r))
  }

  xAtPos (pos) {
    return this._offsetX(1) + this._padding(1) + pos * this._length(1)
  }
  yAtPos (pos, ar) {
    if (pos > this.exp && pos <= this.crux) {
      let slope = (this._bottom(1) - this._peak(1)) / (this.exp - this.crux)
      // calculate y = mx + b
      return this._bottom(1) + slope * (pos - this.exp)
    } else if (pos > this.crux && pos < this.epi) {
      let slope = (this._peak(1) - this._bottom(1)) / (this.crux - this.epi)
      // calculate y = mx + b
      return this._peak(1) + slope * (pos - this.crux)
    } else {
      return this._bottom(1)
    }
  }
  _offsetX (width) {
    return this.offsetX * width
  }
  _offsetY (height) {
    return this.offsetY * height
  }
  _padding (d) {
    return this.padding * d
  }
  _peak (h) {
    return h * (1 - this.peak) - this._offsetY(h) - this._padding(h)
  }
  _bottom (h) {
    return h - this._offsetY(h) - this._padding(h)
  }
  _length (w) {
    return w - 2 * this._padding(w)
  }

  hook (w, h) {
    return {
      x: this._offsetX(w) + this._padding(w) + Math.round(this._length(w) * this.exp),
      y: this._bottom(h)
    }
  }

  climax (w, h) {
    return {
      x: this._offsetX(w) + this._padding(w) + Math.round(this._length(w) * this.crux),
      y: this._peak(h)
    }
  }

  denouement (w, h) {
    return {
      x: this._offsetX(w) + this._padding(w) + Math.round(this._length(w) * this.epi),
      y: this._bottom(h)
    }
  }

  start (w, h) {
    return {
      x: this._offsetX(w) + this._padding(w),
      y: this._bottom(h)
    }
  }

  end (w, h) {
    return {
      x: w - this._padding(w),
      y: this._bottom(h)
    }
  }

  draw (ctx, width, height) {
    const start = this.start(width, height)
    const end = this.end(width, height)
    const hook = this.hook(width, height)
    const climax = this.climax(width, height)
    const den = this.denouement(width, height)

    line(ctx, start.x, start.y, hook.x, hook.y)
    line(ctx, hook.x, hook.y, climax.x, climax.y)
    line(ctx, climax.x, climax.y, den.x, den.y)
    line(ctx, den.x, den.y, end.x, end.y)

    this.addBeat('Hook', this.exp, 10, width, height)
    this.addBeat('Climax', this.crux, 10, width, height)
    this.addBeat('Denouement', this.epi, 10, width, height)
    this.addBeat('#1', 0.2, 10, width, height)
    this.addBeat('#1.5', 0.25, 10, width, height)
    this.addBeat('#2', 0.5, 10, width, height)
    this.addBeat('#2.5', 0.65, 10, width, height)
    this.addBeat('#3', 0.8, 10, width, height)
    this.addBeat('#4', 0.85, 10, width, height)

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
