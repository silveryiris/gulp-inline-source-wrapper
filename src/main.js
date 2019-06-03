import { inlineSource } from "inline-source"
import path from "path"
import through from "through2"
import PluginError from "plugin-error"

const PROJECT_NAME = "gulp-inline-source-wrapper"

export function inlineSourceWrapper(options = {}) {
  const stream = through.obj(async (file, enc, cb) => {
    if (file.isNull() || file.isDirectory()) {
      stream.push(file)
      return cb()
    }

    if (file.isStream()) {
      stream.emit("error", new PluginError(PROJECT_NAME, "Streaming not supported"))
      return cb()
    }

    const defaultOptions = {
      rootpath: path.dirname(file.path),
      htmlpath: file.path
    }

    const pluginOptions = { ...defaultOptions, ...options }

    try {
      const html = await inlineSource(file.contents.toString(), pluginOptions)
      file.contents = new Buffer.from(html || "")
      stream.push(file)
      cb()
    } catch (err) {
      stream.emit("error", new PluginError(PROJECT_NAME, err))
    }
  })

  return stream
}

export default inlineSourceWrapper
