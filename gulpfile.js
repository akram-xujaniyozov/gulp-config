const { src, dest, watch, series } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const cssbeautify = require('gulp-cssbeautify');
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require("sass"));
const gulpclean = require('gulp-clean');
const gulppug = require('gulp-pug');
const browsersync = require('browser-sync').create();


const path = {
  build: {
    html: 'dist/',
    css: 'dist/assets/css/',
    js: 'dist/assets/js',
    img: 'dist/assets/img',
    font: 'dist/assets/fonts/'
  },

  src: {
    pug: 'src/pug/pages/**/*.pug',
    css: 'src/assets/sass/style.scss',
    js:   'src/assets/js/*.js',
    img: 'src/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico}',
    font: 'src/assets/fonts/**/*.{ttf,woff,woff2,svg}'
  },

  watch: {
    pug: 'src/pug/pages/**/*.pug',
    css: 'src/assets/sass/**/*.scss',
    js: 'src/assets/js/**/*.js',
    img: 'src/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico}',
    font: 'src/assets/fonts/**/*.{ttf,woff,woff2,svg}'
  },

  clean: 'dist'
}


function browserSync() {
  browsersync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000
  })
}

async function css() {
  return src(path.src.css, {base: './src/assets/sass'})
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cssbeautify())
  .pipe(dest(path.build.css))
  .pipe(cssmin())
  .pipe(rename({suffix: '.min', extname: '.css'}))
  .pipe(dest(path.build.css))
  .pipe(browsersync.stream());
}

async function js() {
  return src(path.src.js)
  .pipe(plumber())
  .pipe(rigger())
  .pipe(dest(path.build.js))
  .pipe(uglify())
  .pipe(rename({suffix: '.min', extname: '.js'}))
  .pipe(dest(path.build.js))
  .pipe(browsersync.stream())
}

async function pug() {
  return src(path.src.pug, {base: './src/pug/pages'})
  .pipe(plumber())
  .pipe(gulppug({pretty: true}))
  .pipe(dest(path.build.html))
  .pipe(browsersync.stream());
}

async function image() {
  return src(path.src.img)
  .pipe(imagemin())
  .pipe(dest(path.build.img))
}

async function font() {
  return src(path.src.font, {base: 'src/assets/fonts/'})
  .pipe(dest(path.build.font))
  .pipe(browsersync.stream())
}

function clean() {
  return src(path.clean).pipe(gulpclean());
}

async function watchFiles() {
  watch([path.watch.css], css)
  watch([path.watch.pug], pug)
  watch([path.watch.js], js)
  watch([path.watch.img], image)
  watch([path.watch.font], font)
}

const build = series(clean, css, pug, js, image, font);
const watcher = series(build, watchFiles, browserSync)

exports.css = css;
exports.pug = pug;
exports.js = js;
exports.image = image;
exports.font = font;
exports.clean = clean;
exports.build = build;
exports.watcher = watcher;
exports.default = watcher;