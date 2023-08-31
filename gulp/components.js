const gulp = require('gulp');
const jsoncombine = require("gulp-jsoncombine");
const jsonFormat = require('gulp-json-format');
const parse = require("./components-parse");

gulp.task('components', (done) => {

	gulp.src('./../resources/components/base/**/*.json')
		.pipe(jsoncombine("layout.json", (data, meta) => parse(data, meta)))
		.pipe(jsonFormat(4))
		.pipe(gulp.dest('./../resources/layouts'));
	
	done();
});