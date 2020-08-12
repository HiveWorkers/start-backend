'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
var gulpJson = require('gulp-json');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify-es').default;
var strip = require('gulp-strip-comments');
var util = require('gulp-util');
var jsonMinify = require('gulp-json-minify');


const pathDist = './dist-js';
const pathDest = './dist';

// Définissez le navigateur que vous souhaitez prendre en charge 
const AUTOPREFIXER_BROWSERS = [ 
    'ie> = 10', 
    'ie_mob> = 10', 
    'ff> = 30', 
    'chrome> = 34', 
    'safari> = 7', 
    ' opéra> = 23 ', 
    ' ios> = 7 ', 
    ' android> = 4.4 ', 
    ' bb> = 10 ' 
];
// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src('./src/assets/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(csso())
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest('./dist/assets'));
});
//// Gulp task to minify CSS files
//gulp.task('styles', function () {
//    return gulp.src('./assets/**/*.scss')
//        .pipe(sass({
//            outputStyle: 'nested',
//            precision: 10,
//            includePaths: ['.'],
//            onError: console.error.bind(console, 'Sass error:')
//        }))
//        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
//        .pipe(csso())
//        // Output
//        .pipe(gulp.dest('./dist/assets');
//    )
//});
// Gulp task to minify typescript files
gulp.task('typescript', function() {
    return gulp.src(
        [
            './src/**/*.ts'
        ]
    )
    .pipe(
        ts(
            {
                module: "commonjs",
                moduleResolution: "node",
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                resolveJsonModule: true,
                declaration: true,
                target : "ES6",
                types: [ "node", "reflect-metadata" ],
                typeRoots: [
                "node_modules/@types"
                ],
                lib: [
                "es2018",
                "dom"
                ],
                strict: true,
                sourceMap: true
            }
        )
    )
    .pipe(gulp.dest('./dist-js'));
});
// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
    return gulp.src('./dist-js/**/*.js')
    //.pipe(sourcemaps.init())
    //.pipe(concat('index.js'))
    //.pipe(sourcemaps.write())
    //.pipe(uglify())
    //.pipe(minify({
    //    noSource: true,
    //    ext: {
    //        min: '.js'
    //    }
    //}))
    .pipe(strip())
    .pipe(clean({force: true}))
    .pipe(gulp.dest('./dist'));
});
// Gulp task to minify HTML files
gulp.task('pages', function() {
    return gulp.src(['./views/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist/views')
    );
});
// Gulp task to minify JSON files
//gulp.task('json', function() {
//    return gulp.src(
//        [
//            './src/**/*.json'
//            //'./**/*.json',
//            //'!./node_modules/**/*.json',
//            //'!./dist/**/*.json',
//            //'!./dist-js/**/*.json'
//        ])
//        .pipe(gulpJson())
//        .pipe(gulp.dest(pathDest));
//});
gulp.task('json', function() {
    return gulp.src('./src/**/*.json')
        .pipe(jsonMinify())
        .pipe(gulp.dest(pathDest))
        .on('error', util.log);
});
// Clean output directory
gulp.task('clean', () => del(['dist']));
gulp.task('cleanAfter', () => del(['dist-js', 'dist-rollup']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'typescript',
    //'rollup-script',
    'scripts',
    'json',
    'pages',
    'cleanAfter'
  );
});