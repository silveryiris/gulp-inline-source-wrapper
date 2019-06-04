import { inlineSource } from "inline-source"
import path from "path"
import through from "through2"
import GulpInlineSourceWrapperError from "./error.js"

export function inlineSourceWrapper(options = {}) {
  const stream = through.obj(async (chunk, _, cb) => {
    try {
      // Passthrogh
      if (chunk.isNull() || chunk.isDirectory()) {
        return cb(null, chunk)
      } else if (chunk.isStream()) {
        return cb(new GulpInlineSourceWrapperError("Chunk as Stream is not supported"))
      }

      const defaultOptions = {
        rootpath: path.dirname(chunk.path),
        htmlpath: chunk.path
      }

      const pluginOptions = { ...defaultOptions, ...options }

      const html = await inlineSource(chunk.contents.toString(), pluginOptions)
      chunk.contents = new Buffer.from(html || "")
      cb(null, chunk)
    } catch (err) {
      return cb(new GulpInlineSourceWrapperError(err))
    }
  })

  return stream
}

export default inlineSourceWrapper
