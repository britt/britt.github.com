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
class Freytag extends React.Component {
  constructor (props) {
    super(props)
    this.draw = this.draw.bind(this)
  }

  draw (ctx, width, height) {
    const left = this.props.offsetX + width * this.props.padding
    const right = width * (1 - this.props.padding)
    const top = height - this.props.offsetY - this.props.peak
    const bottom = height - this.props.offsetY
    const endExposition = left + Math.round(width * this.props.exp)
    const beginEpilogue = right - Math.round(width * this.props.epi)
    const climax = left + Math.round(width * this.props.crux)

    line(ctx, left, bottom, endExposition, bottom)
    line(ctx, endExposition, bottom, climax, top)
    line(ctx, climax, top, beginEpilogue, bottom)
    line(ctx, beginEpilogue, bottom, right, bottom)
    return true
  }

  render () {
    const {width, height} = this.props
    return <Canvas width={width} height={height} draw={this.draw} />
  }
}

function Canvas ({width, height, draw}) {
  return <canvas ref={(c) => {
    const ctx = configureCanvas(c, width, height)
    draw(ctx, width, height)
  }} />
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
          {/* <Canvas width={640} height={400} draw={freytag} /> */}
          <Freytag
            width={640}
            height={400}
            peak={200}
            exp={0.2}
            crux={0.7}
            epi={0.2}
            padding={0.05}
            offsetX={0}
            offsetY={50} />
        </section>
      </main>
    )
  }
}
