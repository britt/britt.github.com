'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pathResolver;

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _parseFilepath = require('parse-filepath');

var _parseFilepath2 = _interopRequireDefault(_parseFilepath);

var _urlResolver = require('./url-resolver');

var _urlResolver2 = _interopRequireDefault(_urlResolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pathResolver(relativePath) {
  var pageData = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var data = {};

  data.file = (0, _parseFilepath2.default)(relativePath);

  // Remove the . from extname (.md -> md)
  data.file.ext = data.file.extname.slice(1);
  // Make sure slashes on parsed.dirname are correct for Windows
  data.file.dirname = (0, _slash2.default)(data.file.dirname);

  // Determine require path
  data.requirePath = (0, _slash2.default)(relativePath);

  // set the URL path (should this be renamed)
  // and now looking at it, it only needs a reference to pageData
  data.path = (0, _urlResolver2.default)(pageData, data.file);

  // Set the "template path"
  if (data.file.name === '_template') {
    data.templatePath = '/' + data.file.dirname + '/';
  }

  return data;
}