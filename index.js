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

function inlineSourceWrapper(options) {
  const stream = _through.default.obj(async (file, enc, cb) => {
    const self = this;

    if (file.isNull() || file.isDirectory()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new _pluginError.default(_package.packageInfo.name, 'Streaming not supported'));
      return cb();
    }

    const pluginOptions = {
      "rootpath": _path.default.dirname(file.path),
      "htmlpath": file.path
    };

    if (options) {
      for (const optKey in options) {
        pluginOptions[optKey] = options[optKey];
      }
    }

    try {
      const html = await (0, _inlineSource.inlineSource)(file.contents.toString(), pluginOptions);
      file.contents = new Buffer(html || "");
      self.push(file);
    } catch (err) {
      self.emit('error', new _pluginError.default(_package.packageInfo.name, err));
    }

    cb();
  });

  return stream;
}

var _default = inlineSourceWrapper;
exports.default = _default;
