import { inlineSource } from "inline-source"
import path from "path"
import through from "through2"
import PluginError from "plugin-error"
import { packageInfo } from "./package.json"

export function inlineSourceWrapper( options ) {
  const stream = through.obj( async ( file, enc, cb ) => {

    if ( file.isNull() || file.isDirectory() ) {
      stream.push( file )
      return cb()
    }

    if ( file.isStream() ) {
      stream.emit( 'error', new PluginError( packageInfo.name, 'Streaming not supported' ) )
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
      stream.push( file )
      cb()
    } catch ( err ) {
      stream.emit( 'error', new PluginError( packageInfo.name, err ) )
    }

  } )

  return stream
}

export default inlineSourceWrapper
