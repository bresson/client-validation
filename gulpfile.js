var gulp = require('gulp'),
	pug = require('gulp-pug'),
	browserSync = require('browser-sync'),
	babel = require('gulp-babel'),
	cachebust = require('gulp-cache-bust'),
	lost = require('lost'),
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	gulpPlumber = require('gulp-plumber'),
	gulpUtil = require('gulp-util'),
	cssnano = require('cssnano'),
	normalize = require('postcss-normalize'),
	cssnext = require('postcss-cssnext'),
	importPartials = require('postcss-partial-import'),
	reload = browserSync.reload;

    var jsFiles = "src/js-babel/*.js";
    var outputDevJs = "dev/js"
    var cssFiles = "src/postcss/styles.css";
	var outputCss  = "dev/css";
	var browserList = ['> 1%', 'last 4 versions', 'ie > 8', 'iOS 8', 'Safari >= 5', 'Firefox >= 47']

    gulp.task('pug', function() {
	    return gulp.src(['src/pug/**/*.pug', '!src/pug/templates/**/*.pug', '!/scr/**/config.pug' ])
            .pipe(cachebust({
                type: 'timestamp'
            }))
            .pipe(pug({
                pretty: true
            }))	
            .on('error', console.log)
            .pipe(gulp.dest('dev'))
			// .pipe(reload())
});

gulp.task('css', function() {
	var plugins = [
		importPartials({prefix: '_', extension : '.css' }),
		normalize({"browserslist": browserList}),
		lost(),
		cssnext({
			browsers : browserList
		}),
	]
	return gulp.src(cssFiles)
		.pipe(sourcemaps.init())
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(outputCss))
		.pipe(reload({stream: true}))
})

gulp.task('babeljs', function() {
	gulp.src(jsFiles)
		.pipe(cachebust({
        	type: 'timestamp'
		}))
		.pipe(babel())
		.pipe(gulp.dest(outputDevJs))
		// .pipe(reload())
});

// reload page after new HTML ... 
// cannot do it with pug alone as 
// HTML generation not complete?
// need to do the same for JS?
gulp.task('html', function() {
	return gulp.src('src/**/*.html')
		.pipe(cachebust({
        	type: 'timestamp'
		}))
		.on('error', console.log)
		.pipe(reload({stream: true}))
})

gulp.task('serve', function() {
	// browserSync.init(["src/*.html"], {
	// 	server: {baseDir: 'src', index: 'index.html', directory: true},
	// 	notify: true
	// });

	browserSync({
		notify: true,
		server: {
			baseDir: 'dev',
			directory: true,
			index: 'index.html'
		}
	})
});

gulp.task('bs-reload', function() {
	browserSync.reload();
})


gulp.task('default', ['serve', 'css', 'pug'], function() {
	gulp.watch('src/pug/*.pug' , ['pug']);
	gulp.watch('src/pug/**/*.pug' , ['pug']);
	gulp.watch('src/postcss/**/*.css' , ['css']);
	gulp.watch(jsFiles , ['babeljs']);
	gulp.watch(outputDevJs , ['bs-reload']);
	gulp.watch('dev/**/*.html', ['bs-reload']);
});