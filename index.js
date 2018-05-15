"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineSourceWrapper = inlineSourceWrapper;
exports.default = void 0;

var _inlineSource = require("inline-source");

var _path = _interopRequireDefault(require("path"));

var _through = _interopRequireDefault(require("through2"));

var _pluginError = _interopRequireDefault(require("plugin-error"));

var _package = require("./package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function inlineSourceWrapper(options = {}) {
  const stream = _through.default.obj(async (file, enc, cb) => {
    if (file.isNull() || file.isDirectory()) {
      stream.push(file);
      return cb();
    }

    if (file.isStream()) {
      stream.emit('error', new _pluginError.default(_package.packageInfo.name, 'Streaming not supported'));
      return cb();
    }

    const defaultOptions = {
      "rootpath": _path.default.dirname(file.path),
      "htmlpath": file.path
    };

    const pluginOptions = _objectSpread({}, defaultOptions, options);

    try {
      const html = await (0, _inlineSource.inlineSource)(file.contents.toString(), pluginOptions);
      file.contents = new Buffer(html || "");
      stream.push(file);
      cb();
    } catch (err) {
      stream.emit('error', new _pluginError.default(_package.packageInfo.name, err));
    }
  });

  return stream;
}

var _default = inlineSourceWrapper;
exports.default = _default;
