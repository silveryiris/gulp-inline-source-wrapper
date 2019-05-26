// Only out put CommonJS and ES module for node and bundlers.
import meta from "./package.json"
import babel from "rollup-plugin-babel"
import { minify } from "terser"

function compressor(options = { compress: true, mangle: true }) {
  return {
    name: "terser",
    renderChunk(source) {
      return minify(source, options)
    }
  }
}

export default [
  {
    input: "src/main.js",
    output: [{ file: meta.main, format: "cjs" }, { file: meta.module, format: "es" }],
    plugins: [babel({ exclude: ["node_modules/**"] }), compressor()]
  }
]
