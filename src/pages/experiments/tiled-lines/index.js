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

function draw (ctx, x, y, width, height) {
  var leftToRight = Math.random() >= 0.5
  var red = Math.random() >= 0.5
  ctx.strokeStyle = red ? '#f00' : '#000'

  ctx.beginPath()
  if (leftToRight) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y + height)
  } else {
    ctx.moveTo(x + width, y)
    ctx.lineTo(x, y + height)
  }
  ctx.closePath()

  ctx.stroke()
}

function tile (canvas, w, h) {
  const ctx = configureCanvas(canvas, w, h)
  const step = 20

  for (var x = 0; x < canvas.width; x += step) {
    for (var y = 0; y < canvas.height; y += step) {
      draw(ctx, x, y, step, step)
    }
  }
}

export default class TiledLines extends Component {
  render () {
    return (
      <main className='container'>
        <Helmet title='Tiled Lines - generative art experiment'>
          <style>
            {'canvas {box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);}'}
          </style>

        </Helmet>
        <section>
          <h2>Tiled Lines</h2>
          <p>
            I followed a tutorial on <a href='https://generativeartistry.com/tutorials/tiled-lines/' title='Tiled Lines Tutorial'>
              generativeartistry.com
            </a> to create this line pattern using HTML canvas and Javascript. Reload the page. It's different every time.
          </p>
        </section>
        <canvas ref={(c) => tile(c, 630, 630)} />
      </main>
    )
  }
}
