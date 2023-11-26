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

function joyDivision (canvas, w, h) {
  const ctx = configureCanvas(canvas, w, h)
  const step = 30
  const lines = []
  const size = w

  for (let i = step * 4; i <= size - step; i += step) {
    let line = []
    for (let j = 0; j <= size; j += step) {
      let distanceToCenter = Math.abs(j - size / 2)
      let variance = Math.max(size / 2 - 100 - distanceToCenter, 0)
      let random = Math.random() * variance / 2 * -1
      let point = {x: j, y: i + random}
      line.push(point)
    }
    lines.push(line)
  }

  for (let i = 0; i < lines.length; i++) {
    var red = Math.random() >= 0.5
    ctx.strokeStyle = '#fff'
    ctx.fillStyle = red ? '#D32F2F' : '#212121'

    ctx.beginPath()
    ctx.moveTo(lines[i][0].x, lines[i][0].y)

    for (var j = 0; j < lines[i].length - 2; j++) {
      let xc = (lines[i][j].x + lines[i][j + 1].x) / 2
      let yc = (lines[i][j].y + lines[i][j + 1].y) / 2
      ctx.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc)
    }
    ctx.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y)

    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fill()
    ctx.restore()
    ctx.fill()
    ctx.stroke()
  }
}

export default class JoyDivision extends Component {
  render () {
    return (
      <main className='container'>
        <Helmet title='Japan Division - generative art experiment'>
          <style>
            {'canvas {box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);}'}
          </style>

        </Helmet>
        <section>
          <h2>Japan Division</h2>
          <p>
            I took the <a href='https://generativeartistry.com/tutorials/joy-division/' title='Joy Division Album Cover Tutorial'>
              Joy Division tutorial on generativeartistry.com
            </a> and messed around with it a bit. It ended up looking a bit like something you might see in
            the lobby of a 1980's Japanese electronics company.
          </p>
        </section>
        <section>
          <canvas ref={(c) => joyDivision(c, 630, 630)} />
          <p>
            <em>Reload the page. It's different every time.</em>
          </p>
        </section>
      </main>
    )
  }
}
