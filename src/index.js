import { inlineSource } from "inline-source"
import path from "path"
import through from "through2"
import PluginError from "plugin-error"
import { packageInfo } from "./package.json"

export function inlineSourceWrapper( options ) {
  const stream = through.obj( async ( file, enc, cb ) => {

    const self = this

    if ( file.isNull() || file.isDirectory() ) {
      this.push( file )
      return cb()
    }

    if ( file.isStream() ) {
      this.emit( 'error', new PluginError( packageInfo.name, 'Streaming not supported' ) )
      return cb()
    }

    const pluginOptions = {
      "rootpath": path.dirname( file.path ),
      "htmlpath": file.path
    }

    if ( options ) {
      for ( const optKey in options ) {
        pluginOptions[ optKey ] = options[ optKey ]
      }
    }

    try {
      const html = await inlineSource( file.contents.toString(), pluginOptions )
      file.contents = new Buffer( html || "" )
      self.push( file )
    } catch ( err ) {
      self.emit( 'error', new PluginError( packageInfo.name, err ) )
    }

    cb()

  } )

  return stream
}

export default inlineSourceWrapper
