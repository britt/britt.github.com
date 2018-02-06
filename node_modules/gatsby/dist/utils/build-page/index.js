'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildPage;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _pathResolver = require('./path-resolver');

var _pathResolver2 = _interopRequireDefault(_pathResolver);

var _loadFrontmatter = require('./load-frontmatter');

var _loadFrontmatter2 = _interopRequireDefault(_loadFrontmatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildPage(directory, page) {
  var pageData = (0, _loadFrontmatter2.default)(page);

  var relativePath = _path2.default.relative(_path2.default.join(directory, 'pages'), page);
  var pathData = (0, _pathResolver2.default)(relativePath, pageData);

  return (0, _objectAssign2.default)({}, pathData, { data: pageData });
}