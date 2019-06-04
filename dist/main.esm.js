import{inlineSource}from"inline-source";import path from"path";import through from"through2";class GulpInlineSourceWrapperError extends Error{constructor(...r){super(...r),this.name=this.constructor.name}}function inlineSourceWrapper(r={}){return through.obj(async(e,t,n)=>{try{if(e.isNull()||e.isDirectory())return n(null,e);if(e.isStream())return n(new GulpInlineSourceWrapperError("Chunk as Stream is not supported"));const t={...{rootpath:path.dirname(e.path),htmlpath:e.path},...r},o=await inlineSource(e.contents.toString(),t);e.contents=new Buffer.from(o||""),n(null,e)}catch(r){return n(new GulpInlineSourceWrapperError(r))}})}export default inlineSourceWrapper;export{inlineSourceWrapper};
