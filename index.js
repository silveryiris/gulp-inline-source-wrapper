"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.inlineSourceWrapper=inlineSourceWrapper,exports.default=void 0;var _inlineSource=require("inline-source"),_path=_interopRequireDefault(require("path")),_through=_interopRequireDefault(require("through2")),_pluginError=_interopRequireDefault(require("plugin-error")),_package=require("./package.json");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _objectSpread(a){for(var b=1;b<arguments.length;b++){var c=null==arguments[b]?{}:arguments[b],d=Object.keys(c);"function"==typeof Object.getOwnPropertySymbols&&(d=d.concat(Object.getOwnPropertySymbols(c).filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable}))),d.forEach(function(b){_defineProperty(a,b,c[b])})}return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function inlineSourceWrapper(a={}){const b=_through.default.obj(async(c,d,e)=>{if(c.isNull()||c.isDirectory())return b.push(c),e();if(c.isStream())return b.emit("error",new _pluginError.default(_package.packageInfo.name,"Streaming not supported")),e();const f={rootpath:_path.default.dirname(c.path),htmlpath:c.path},g=_objectSpread({},f,a);try{const a=await(0,_inlineSource.inlineSource)(c.contents.toString(),g);c.contents=new Buffer(a||""),b.push(c),e()}catch(a){b.emit("error",new _pluginError.default(_package.packageInfo.name,a))}});return b}var _default=inlineSourceWrapper;exports.default=_default;
