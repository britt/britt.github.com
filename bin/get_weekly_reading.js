#!/usr/bin/env node

import FS from 'fs'
import OS from 'os'
import Path from 'path'
import ChildProcess from 'child_process'
import TOML from 'toml-js'
import moment from 'moment'

function feedback (msg) {
  return process.stdout.write(msg)
}

function saveWeek (week, articles) {
  const data = {
    'title': 'Reading ' + week.format('MMMM Do, YYYY'),
    'week': week.format('MMMM Do, YYYY'),
    articles
  }

  const outputPath = Path.join(process.cwd(), 'pages/reading/', week.format('YYYY-MM-DD'))
  const outputFileName = outputPath + '/index.json'

  FS.access(outputPath, FS.F_OK, (err) => {
    if (err) {
      try {
        FS.mkdirSync(outputPath, (err, data) => {
          if (err && err.toString().match(/EEXIST/) === null) {
            process.stderr.write(err.toString())
            process.exit(1)
          }
        })
      } catch (e) {
        console.log('incorrectly tried to recreate an existing directory', err)
      }
    }

    FS.writeFileSync(outputFileName, JSON.stringify(data))
  })
}

const tempFileName = Path.join(OS.tmpdir(), 'reading.json')

function Main () {
  // load config
  let cfgData = FS.readFileSync(Path.join(__dirname, '..', 'config.toml'))
  let config = TOML.parse(cfgData)

  // fetch reading data
  let ssId = config.reading.google_sheet_id
  let start = moment()
  feedback('Fetching reading data...')
  ChildProcess.execSync(`gsjson ${ssId} ${tempFileName}`)
  feedback(`complete ${moment().diff(start, 'seconds', true)}s\n`)

  // parse reading data
  start = moment()
  feedback('Parsing articles...')
  let articles = JSON.parse(FS.readFileSync(tempFileName))
  // accumulate and persist
  let currentWeek = null
  let weeksArticles = []
  articles.forEach(article => {
    let week = moment(article['date_liked'], 'MMMM DD, YYYY at hh:mmA').startOf('week')
    if (!week.isSame(currentWeek)) {
      if (currentWeek !== null && weeksArticles.length > 0) {
        saveWeek(currentWeek, weeksArticles)
        feedback('Saved week of ' + currentWeek.format('MMMM Do, YYYY') + ` ${weeksArticles.length} articles.\n`)
      }
      currentWeek = week
      weeksArticles = []
    }

    weeksArticles.push(article)
  })
  // save the most recent week
  if (weeksArticles.length > 0) {
    saveWeek(currentWeek, weeksArticles)
    feedback('Saved week of ' + currentWeek.format('MMMM Do, YYYY') + ` ${weeksArticles.length} articles.`)
  }
  feedback(`complete ${moment().diff(start, 'seconds', true)}s\n`)
}

Main()
