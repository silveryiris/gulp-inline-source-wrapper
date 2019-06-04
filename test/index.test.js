import inlineSourceWrapper from "../src/main.js"
import wrapperEsmVersion from "../dist/main.esm.js"
import path from "path"
import fs from "fs"
import Vinyl from "vinyl"
import through2 from "through2"
import { expect } from "chai"
import { Stream } from "stream"

async function loadVinylObject(location) {
  return new Vinyl({ path: location, contents: await fs.promises.readFile(location) })
}

function compareInlineResult(target, done) {
  return through2.obj(chunk => {
    const code = chunk.contents.toString()
    expect(target.contents.toString()).to.equal(code)
    done()
  })
}

describe("Prevent Vinyl source error", () => {
  const testFilePath = path.resolve(__dirname, "./fixtures/dummy.html")

  it("Passthroght when Vinyl content is Null or Directory", done => {
    fs.createReadStream(testFilePath)
      .pipe(
        through2.obj((chunk, _, cb) => {
          const vinylFile = new Vinyl({ contents: null })
          cb(null, vinylFile)
        })
      )
      .pipe(inlineSourceWrapper({ compress: true }))
      .pipe(
        through2.obj((chunk, _, cb) => {
          expect(chunk.isNull()).equal(true)
          cb()
          done()
        })
      )
  })

  it("Correctly handle input content is stream error", done => {
    fs.createReadStream(testFilePath)
      .pipe(
        through2.obj((chunk, _, cb) => {
          const vinylFile = new Vinyl({ contents: new Stream.Readable() })
          cb(null, vinylFile)
        })
      )
      .pipe(
        inlineSourceWrapper({ compress: true }).on("error", err => {
          expect(err.name).equal("GulpInlineSourceWrapperError")
          expect(err.message).equal("Chunk as Stream is not supported")
          done()
        })
      )
  })
})

describe("Inline CSS links in html file with mark.", () => {
  let testFilePath = null
  let target = null

  before(async () => {
    testFilePath = path.resolve(__dirname, "./fixtures/test-style.html")
    target = await loadVinylObject(path.resolve(__dirname, "expect/test-style.html"))
  })

  it("Inline css style file link", done => {
    fs.createReadStream(testFilePath)
      .pipe(
        through2.obj((chunk, _, cb) => {
          const vinylFile = new Vinyl({ path: testFilePath, contents: chunk })
          cb(null, vinylFile)
        })
      )
      .pipe(inlineSourceWrapper({ compress: true }))
      .pipe(compareInlineResult(target, done))
  })

  it("Inline css style file link with esm lib", done => {
    fs.createReadStream(testFilePath)
      .pipe(
        through2.obj((chunk, _, cb) => {
          const vinylFile = new Vinyl({ path: testFilePath, contents: chunk })
          cb(null, vinylFile)
        })
      )
      .pipe(wrapperEsmVersion({ compress: true }))
      .pipe(compareInlineResult(target, done))
  })
})

describe("Inline script links in html file with mark.", () => {
  let testFilePath = null
  let target = null

  before(async () => {
    testFilePath = path.resolve(__dirname, "./fixtures/test-script.html")
    target = await loadVinylObject(path.resolve(__dirname, "expect/test-script.html"))
  })

  it("Inline javascript file link", done => {
    fs.createReadStream(testFilePath)
      .pipe(
        through2.obj((chunk, _, cb) => {
          const vinylFile = new Vinyl({ path: testFilePath, contents: chunk })
          cb(null, vinylFile)
        })
      )
      .pipe(inlineSourceWrapper({ compress: true }))
      .pipe(
        through2.obj((chunk, _, cb) => {
          const code = chunk.contents
          expect(code.compare(target.contents)).to.equal(1)
          cb()
          done()
        })
      )
  })

  it("Inline javascript file link with esm lib", done => {
    fs.createReadStream(testFilePath)
      .pipe(
        through2.obj((chunk, _, cb) => {
          const vinylFile = new Vinyl({ path: testFilePath, contents: chunk })
          cb(null, vinylFile)
        })
      )
      .pipe(wrapperEsmVersion({ compress: true }))
      .pipe(
        through2.obj((chunk, _, cb) => {
          const code = chunk.contents
          expect(code.compare(target.contents)).to.equal(1)
          cb()
          done()
        })
      )
  })
})
