import React, {Component, PureComponent} from 'react'
import Helmet from 'react-helmet'

// TODO: decompose into files

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

function circle (ctx, x, y, r, color = '#000', fillColor = '#000') {
  let resetStroke = ctx.strokeStyle
  let resetFill = ctx.fillStyle
  ctx.strokeStyle = color
  ctx.fillStyle = fillColor
  ctx.beginPath()
  ctx.arc(x, y, r, Math.PI * 2, 0)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
  ctx.strokeStyle = resetStroke
  ctx.fillStyle = resetFill
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
    circle(ctx, x, y, r, '#000', '#fff')
    ctx.font = 'Montserrat, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(this.name, x, y - r * 1.3)
  }
}

const defaultFreytag = {
  exp: 0.1,
  crux: 0.7,
  epi: 0.9,
  offsetEpi: 0.125,
  padding: 0.05,
  offsetX: 0,
  offsetY: 0.125,
  peak: 0.5,
  defBeatRadius: 10,
  beats: [],
  xScale: 1,
  yScale: 1
}

const inMediaRes = {
  exp: 0.1,
  crux: 0.8,
  epi: 0.9,
  offsetEpi: -0.1,
  padding: 0.05,
  offsetX: 0,
  offsetY: 0.25,
  peak: 0.4,
  defBeatRadius: 10,
  beats: [],
  xScale: 1,
  yScale: 1
}

// TODO: add scaling factor
// TODO: scaling demands better offset model
class Freytag {
  constructor (props) {
    this.addBeat = this.addBeat.bind(this)

    let merged = {...defaultFreytag, ...props}
    this.exp = merged.exp
    this.epi = merged.epi
    this.crux = merged.crux
    this.peak = merged.peak
    this.padding = merged.padding
    this.offsetX = merged.offsetX
    this.offsetY = merged.offsetY
    this.offsetEpi = merged.offsetEpi
    this.beatBuilders = []
    this._beats = []

    this.addBeat('Hook', this.exp, 15)
    this.addBeat('Climax', this.crux, 15)
    this.addBeat('Denouement', this.epi, 15)

    merged.beats.forEach(b => this.addBeat(b.name, b.pos, b.r))
  }

  addBeat (name, pos, r) {
    let builder = (w, h) => {
      let [x, y] = [
        w * this.x(pos),
        h * this.y(pos)]
      return new StoryBeat(name, x, y, r)
    }
    builder = builder.bind(this)
    this.beatBuilders.push(builder)
  }

  x (pos) {
    return this._offsetX(1) + this._padding(1) + pos * this._length(1)
  }

  y (pos) {
    if (pos <= this.exp) {
      return this._bottom(1)
    } else if (pos > this.exp && pos <= this.crux) {
      let slope = (this._bottom(1) - this._peak(1)) / (this.exp - this.crux)
      // calculate y = mx + b
      return this._bottom(1) + slope * (pos - this.exp)
    } else if (pos > this.crux && pos < this.epi) {
      let slope = (this._peak(1) - this.denouement(1, 1).y) / (this.crux - this.epi)
      // calculate y = mx + b
      return this._peak(1) + slope * (pos - this.crux)
    } else {
      return this._bottom(1) - this._offsetEpi(1)
    }
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
      y: this._bottom(h) - this._offsetEpi(h)
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
      y: this._bottom(h) - this._offsetEpi(h)
    }
  }

  draw (ctx, width, height) {
    const start = this.start(width, height)
    const end = this.end(width, height)
    const hook = this.hook(width, height)
    const climax = this.climax(width, height)
    const den = this.denouement(width, height)

    // draw the plot line
    line(ctx, start.x, start.y, hook.x, hook.y)
    line(ctx, hook.x, hook.y, climax.x, climax.y)
    line(ctx, climax.x, climax.y, den.x, den.y)
    line(ctx, den.x, den.y, end.x, end.y)
    // add the story beats
    this._beats = this.beatBuilders.map(bb => bb(width, height))
    this._beats.forEach(b => b.draw(ctx, width, height))
  }

  _offsetX (width) {
    return this.offsetX * width
  }
  _offsetY (height) {
    return this.offsetY * height
  }
  _offsetEpi (height) {
    return this.offsetEpi * height
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
}

class InMediaRes extends Freytag {
  constructor (props) {
    let merged = {...inMediaRes, ...props}
    super({...inMediaRes, ...props})
    this.beatBuilders = []
    // TODO: override default beats instead
    this.addBeat('Middle Crisis', this.exp, 15)
    this.addBeat('Climax', this.crux, 15)
    this.addBeat('Resolution', this.epi, 15)

    merged.beats.forEach(b => this.addBeat(b.name, b.pos, b.r))
  }
}

class ThreeAct extends Freytag {
  draw (ctx, width, height) {
  }
}

class DoubleFreytag {
  constructor (a, b) {
    this._act1 = new Freytag(a)
    this._act2 = new Freytag(b)
  }

  draw (ctx, width, height) {
    this._act1.draw(ctx, width, height)
    this._act2.draw(ctx, width, height)
  }
}

class Fichtean extends Freytag {
  draw (ctx, width, height) {
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
        <header>
          <h2>Plots</h2>
        </header>
        <section>
          <h3>Freytag Pyramid</h3>
          <p>
            The classic five part dramatic structure consisting of:
            <ol>
              <li>Exposition</li>
              <li>Rising Action</li>
              <li>Climax</li>
              <li>Falling Action</li>
              <li>Denouement</li>
            </ol>
          </p>
          <p>
            <em><a href='https://en.wikipedia.org/wiki/Dramatic_structure' title='wikipedia article on the Freytag Pyramid'>wikipedia</a></em>
          </p>
          <Canvas
            width={640}
            height={400}
            drawings={[
              new Freytag({
                exp: 0.15,
                beats: [
                  {name: '#1', pos: 0.2, r: 10},
                  {name: '#2', pos: 0.25, r: 10},
                  {name: '#3', pos: 0.5, r: 10},
                  {name: '#4', pos: 0.65, r: 10},
                  {name: '#5', pos: 0.75, r: 10},
                  {name: '#6', pos: 0.8, r: 10}
                ]
              })
            ]}
          />
        </section>
        <section>
          <h3>In Media Res</h3>
          <Canvas
            width={640}
            height={400}
            drawings={[
              new InMediaRes({
                beats: [
                  {name: '#1', pos: 0.2, r: 10},
                  {name: '#2', pos: 0.25, r: 10},
                  {name: '#3', pos: 0.5, r: 10},
                  {name: '#4', pos: 0.65, r: 10},
                  {name: '#5', pos: 0.75, r: 10},
                  {name: '#6', pos: 0.85, r: 10}
                ]
              })
            ]}
          />
        </section>
        <section>
          <h3>Double Freytag</h3>
          <Canvas
            width={640}
            height={400}
            drawings={[
              new DoubleFreytag({
                exp: 0.15,
                beats: [
                  {name: '#1', pos: 0.2, r: 10},
                  {name: '#2', pos: 0.25, r: 10},
                  {name: '#3', pos: 0.5, r: 10},
                  {name: '#4', pos: 0.65, r: 10},
                  {name: '#5', pos: 0.75, r: 10},
                  {name: '#6', pos: 0.8, r: 10}
                ]
              },
              {
                exp: 0.15,
                beats: [
                  {name: '#1', pos: 0.2, r: 10},
                  {name: '#2', pos: 0.25, r: 10},
                  {name: '#3', pos: 0.5, r: 10},
                  {name: '#4', pos: 0.65, r: 10},
                  {name: '#5', pos: 0.75, r: 10},
                  {name: '#6', pos: 0.8, r: 10}
                ]
              })
            ]}
          />
        </section>
      </main>
    )
  }
}
