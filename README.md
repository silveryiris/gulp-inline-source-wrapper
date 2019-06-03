# gulp-inline-source-wrapper

[![david-dm](https://david-dm.org/silveryiris/gulp-inline-source-wrapper.svg)](https://david-dm.org/silveryiris/gulp-inline-source-wrapper)

## About this project

- Source codes style is `ES2017` syntax compiled to `esm` and `cjs` version.
- Dependencies only 3 packages with latest stable version.
- This project is wrap the `inline-source` package with stream to adapt the `gulp@4`.

## To do
- Rewrite test cases. 

## Installing

```
npm i gulp-inline-source-wrapper
```

## Example
```` javascript
import gulp from "gulp"
import inlineSource from "gulp-inline-source-wrapper"

gulp.task( "merge:inline", () => {
  return gulp.src( "dist/**/index.html" )
    .pipe( inlineSource( { "compress": false } ) )
    .pipe( gulp.dest( "dist" ) )
} )
````

You can checkout the [inline-source](https://github.com/popeindustries/inline-source) repository for more detailed use case.


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
