module.exports = {
  prod: {
    pug: 'prod/',
    html: 'prod/',
    js: 'prod/js/',
    css: 'prod/css/',
    img: 'prod/img/',
    fonts: 'prod/fonts/'
  },
  build: {
    pug: 'dist/',
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: {
    pug: 'src/pug/*.pug',
    html: 'src/*.html',
    js: 'src/js/*.js',
    js_path: 'src/js/.',
    js_common: 'src/js/common/*.js',
    js_plugins: 'src/js/plugins/*.js',
    js_core: 'src/js/core/*.js',
    jshint: 'src/js/**/*.js',
    style: 'src/style/*.css',
    style_path: 'src/style/.',
    style_common: 'src/style/common/*.css',
    style_plugins: 'src/style/plugins/*.css',
    style_core: 'src/style/core/*.css',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    pug: 'src/pug/**/*.pug',
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.css',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './dist'
};