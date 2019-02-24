import React, {Component} from 'react'
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

function trees (canvas, w, h) {
  const ctx = configureCanvas(canvas, w, h)
  const ground = h * 3 / 4
  const nTrees = 1
  const scaling = 0.72
  const minSize = 5
  const maxBranchings = 20
  // draw the ground line
  ctx.beginPath()
  ctx.moveTo(0, ground)
  ctx.lineTo(w, ground)
  ctx.closePath()
  ctx.stroke()

  let xStep = w / (nTrees + 1)
  for (let i = 0; i < nTrees; i++) {
    let x = xStep * (i + 1)
    let y = ground
    for (let j = 1; (h - ground) * (scaling ^ j) > minSize && j < maxBranchings; j++) {
      console.log('Step', j)

      let stepSize = (h - ground) * (Math.pow(scaling, j))
      let prevStepSize = (h - ground) * (Math.pow(scaling, j - 1 < 0 ? 0 : j - 1))
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - stepSize)
      // TODO: use procderual branches instead
      for (let k = 0; k < j - 1; k++) {
        let xRight = x + prevStepSize * Math.SQRT2 * k
        let xLeft = x - prevStepSize * k
        ctx.moveTo(xRight, y)
        ctx.lineTo(xRight + stepSize, y - stepSize)
        ctx.moveTo(xRight, y)
        ctx.lineTo(xRight - stepSize, y - stepSize)
        ctx.moveTo(xLeft, y)
        ctx.lineTo(xLeft + stepSize, y - stepSize)
        ctx.moveTo(xLeft, y)
        ctx.lineTo(xLeft - stepSize, y - stepSize)
      }
      ctx.closePath()
      ctx.stroke()
      y -= stepSize
    }
  }
}

export default class Trees extends Component {
  render () {
    return (
      <main className='container'>
        <Helmet title='Trees - generative art experiment'>
          <style>
            {'canvas {box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);}'}
          </style>

        </Helmet>
        <section>
          <h2>Trees</h2>
          <p>
            Blah blah
          </p>
        </section>
        <section>
          <canvas ref={(c) => trees(c, 630, 630)} />
          <p>
            <em>Reload the page. It's different every time.</em>
          </p>
        </section>
      </main>
    )
  }
}
