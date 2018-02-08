'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchSheet = require(`./fetch-sheet.js`);
const uuidv5 = require('uuid/v5');
const _ = require('lodash');
const crypto = require('crypto');
const seedConstant = '2972963f-2fcf-4567-9237-c09a2b436541';

exports.sourceNodes = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* ({ boundActionCreators, getNode, store, cache }, { spreadsheetId, worksheetTitle, credentials }) {
    const { createNode, setPluginStatus } = boundActionCreators;

    let rows = yield fetchSheet(spreadsheetId, worksheetTitle, credentials);

    rows.forEach(function (r) {
      /* console.log(
          _.mapValues(r, (val, key) => ({
              isNull: _.isNull(val),
              isNumber: _.isFinite(val),
              isString: _.isString(val)
          }))
      ); */

      r = _.mapValues(r, function (v) {
        return !v ? '' : v;
      });
      const o = Object.assign(r, {
        id: uuidv5(r.id, uuidv5('gsheet', seedConstant)),
        parent: '__SOURCE__',
        children: [],
        internal: {
          type: _.camelCase(`googleSheet ${worksheetTitle} row`),
          contentDigest: crypto.createHash('md5').update(JSON.stringify(r)).digest('hex')
        }
      });
      createNode(o);
    });

    setPluginStatus({ lastFetched: Date.now() });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();