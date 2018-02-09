const fetchSheet = require(`./fetch-sheet.js`)
const uuidv5 = require('uuid/v5')
const _ = require('lodash')
const crypto = require('crypto')
const seedConstant = '2972963f-2fcf-4567-9237-c09a2b436541'
const moment = require('moment')

exports.sourceNodes = async (
    { boundActionCreators, getNode, store, cache },
    { spreadsheetId, worksheetTitle, credentials }
) => {
  const { createNode, setPluginStatus } = boundActionCreators

  let rows = await fetchSheet(spreadsheetId, worksheetTitle, credentials)

  rows.forEach(r => {
        /* console.log(
            _.mapValues(r, (val, key) => ({
                isNull: _.isNull(val),
                isNumber: _.isFinite(val),
                isString: _.isString(val)
            }))
        ); */

    r = _.mapValues(r, v => !v ? '' : v)
    let week = moment(r.dateliked, 'MMMM DD, YYYY at hh:mmA').startOf('week')
    const o = Object.assign(r, {week: `${week.format('YYYY-MM-DD')}`}, {
      id: uuidv5(r.id, uuidv5('gsheet', seedConstant)),
      parent: '__SOURCE__',
      children: [],
      internal: {
        type: _.camelCase(`googleSheet ${worksheetTitle} row`),
        contentDigest: crypto
                  .createHash('md5')
                  .update(JSON.stringify(r))
                  .digest('hex')
      }
    })
    createNode(o)
  })

  setPluginStatus({ lastFetched: Date.now() })
}
