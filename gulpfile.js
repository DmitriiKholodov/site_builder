'use strict';

// INIT
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'), // optimize plugin load
    $ = gulpLoadPlugins(), // optimize plugin load
    connect = require('browser-sync'),
    reload = connect.reload,
    //connect = require('gulp-connect'),

    watch = require('gulp-watch'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    plumber = require('gulp-plumber'),
    pump = require('pump'),
    pug = require('gulp-pug'),
    prettify = require('gulp-html-prettify'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    postcss = require('gulp-postcss'),
    //autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-clean-css'),
    //imagemin = require('gulp-imagemin'),
    //pngquant = require('imagemin-pngquant'),
    gutil = require('gulp-util');

// PATHS
var path = require('./gulp/paths');


// ___________________________ BUILD FOR DEV ________________________________________
// dev server config
var config = {
  open: false,
  server: {
    baseDir: "./dist"
  },
  online: false,
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "Test Webserver"
};
// dev gulp tasks
gulp.task('connect', function () {
  connect(config);
});
/*gulp.task('connect', function () {
  connect.server({ //настриваем конфиги сервера
    root: ['./dist'], //корневая директория запуска сервера
    port: 9000, //какой порт будем использовать
    livereload: true //инициализируем работу LiveReload
  });
});
gulp.task('html:build', function () {
  gulp.src(path.src.html)
      .pipe(rigger())
      .pipe(gulp.dest(path.build.html))
      .pipe(connect.reload({stream: true}));
});*/
gulp.task('pug:build', function () {
  gulp.src(path.src.pug)
      .pipe(rigger())
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(pug(
          {
            pretty: true
          }
      ))
      .pipe(prettify({
        indent_char: '	',
        indent_size: 1
      }))
      .pipe(gulp.dest(path.build.pug))
      .pipe(connect.reload({stream: true}));
});
gulp.task('jshint:build', function () {
  return gulp.src(path.src.jshint) //выберем файлы по нужному пути
      .pipe(jshint()) //прогоним через jshint
      .pipe(jshint.reporter('jshint-stylish')); //стилизуем вывод ошибок в консоль
});
gulp.task('js:build', function () {
  gulp.src(path.src.js) //Найдем наш main файл
      .pipe(rigger()) //Прогоним через rigger
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(sourcemaps.init()) //Инициализируем sourcemap
      .pipe(babel({//ES babel
        presets: ['env']
      }))
      //.pipe(babel())
      //.pipe(uglify()) //Сожмем наш js
      .pipe(sourcemaps.write()) //Пропишем карты
      .pipe(gulp.dest(path.build.js)) //выгрузим готовый файл в build
      .pipe(connect.reload({stream: true})) //И перезагрузим сервер
});
gulp.task('style:build', function () {
  gulp.src(path.src.style)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(postcss(
          [
            require('precss'),
            require('postcss-nested'),
            require('postcss-nested-props'),
            require('postcss-assets')({
              loadPaths: ['img/', '/', 'img/**/*'],
              basePath: 'dist'
            }),
            require('autoprefixer')({browsers: ['last 1 versions']}),
            require('postcss-crip'),
            require('postcss-each'),
            require('postcss-for'),
            require('postcss-mixins')({mixinsFiles: './src/style/global/_mixins.css'}),
            require('postcss-simple-vars'),
          ]
      ))
      //.pipe(cssmin())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(connect.reload({stream: true}))
});
gulp.task('image:build', function () {
  gulp.src(path.src.img) //Выберем наши картинки
      .pipe(gulp.dest(path.build.img)) //выгрузим в build
});
gulp.task('fonts:build', function () {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});
/*gulp.task('scripts:build', function () {
  gulp.src([
    path.src.js_common,
    path.src.js_plugins
  ], {base: path.src.js_path})
      .pipe(gulp.dest(path.build.js))
});*/
gulp.task('scripts:build', function () {
  gulp.src(path.src.js_common)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('common.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.js));
  gulp.src(path.src.js_plugins)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('plugins.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.js));
  gulp.src(path.src.js_core)
      .pipe(gulp.dest(path.build.js));
});
/*gulp.task('styles:build', function () {
  gulp.src([
    path.src.style_common,
    path.src.style_plugins
  ], {base: path.src.style_path})
      .pipe(concat('common.css'))
      .pipe(gulp.dest(path.build.css)) //выгрузим в build
});*/
gulp.task('styles:build', function () {
  gulp.src(path.src.style_common)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('common.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css));
  gulp.src(path.src.style_plugins)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(sourcemaps.init())
      .pipe(concat('plugins.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css));
  gulp.src(path.src.style_core)
      .pipe(gulp.dest(path.build.css));
});
// dev main gulp task
gulp.task('build', [
  //'html:build',
  'fonts:build',
  'image:build',
  'pug:build',
  'style:build',
  'styles:build',
  'js:build',
  'scripts:build',
  //'jshint:build',
]);

// ___________________________ BUILD FOR PROD ____________________________________
// build server config
var config_prod = {
  open: false,
  server: {
    baseDir: "./prod"
  },
  online: false,
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "Test Webserver"
};
// build gulp tasks
gulp.task('connect:prod', function () {
  connect(config_prod);
});
gulp.task('pug:prod', function () {
  gulp.src(path.src.pug)
      .pipe(rigger())
      .pipe(pug(
          {
            pretty: true
          }
      ))
      .pipe(prettify({
        indent_char: '	',
        indent_size: 1
      }))
      .pipe(gulp.dest(path.prod.pug))
});
gulp.task('js:prod', function () {
  gulp.src(path.src.js) //Найдем наш main файл
      .pipe(rigger()) //Прогоним через rigger
      .pipe(babel({//ES babel
        presets: ['env']
      }))
      .pipe(uglify()) //Сожмем наш js
      .pipe(gulp.dest(path.prod.js)) //выгрузим готовый файл в prod
});
gulp.task('style:prod', function () {
  gulp.src(path.src.style)
      .pipe(postcss(
          [
            require('precss'),
            require('postcss-nested'),
            require('postcss-nested-props'),
            require('postcss-assets')({
              loadPaths: ['img/', '/', 'img/**/*'],
              basePath: 'prod'
            }),
            require('autoprefixer')({browsers: ['> 0.1%', 'last 30 versions']}),
            require('postcss-crip'),
            require('postcss-each'),
            require('postcss-for'),
            require('postcss-mixins')({mixinsFiles: './src/style/global/_mixins.css'}),
            require('postcss-simple-vars'),
          ]
      ))
      .pipe(cssmin())
      .pipe(gulp.dest(path.prod.css))
});
gulp.task('image:prod', function () {
  gulp.src(path.src.img) //Выберем наши картинки
      .pipe(gulp.dest(path.prod.img)) //выгрузим в prod
});
gulp.task('fonts:prod', function () {
  gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.prod.fonts))
});
gulp.task('scripts:prod', function () {
  gulp.src(path.src.js_common)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(concat('common.js'))
      .pipe(uglify())
      .pipe(gulp.dest(path.prod.js));
  gulp.src(path.src.js_plugins)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(concat('plugins.js'))
      .pipe(uglify())
      .pipe(gulp.dest(path.prod.js));
  gulp.src(path.src.js_core)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(uglify())
      .pipe(gulp.dest(path.prod.js));
});
gulp.task('styles:prod', function () {
  gulp.src(path.src.style_common)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(concat('common.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(path.prod.css));
  gulp.src(path.src.style_plugins)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(concat('plugins.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(path.prod.css));
  gulp.src(path.src.style_core)
      .pipe(plumber({
        errorHandler: function (error) {
          gutil.log([
            (error.name + ' in ' + error.plugin).bold.red,
            '',
            error.message,
            ''
          ].join('\n'));
        }
      }))
      .pipe(cssmin())
      .pipe(gulp.dest(path.prod.css));
});
// build main task
gulp.task('prod', [
  'fonts:prod',
  'image:prod',
  //'html:build',
  'pug:prod',
  'style:prod',
  'styles:prod',
  'js:prod',
  'scripts:prod',
  //'connect:prod'
]);

// WATCH (for dev)
gulp.task('watch', function () {
  // watch([path.watch.html], function(event, cb) {
  //     gulp.start('html:build');
  // });
    global.watch = true;
  gulp.watch([path.watch.pug], function (event, cb) {
    gulp.start('pug:build');
  });
    gulp.watch([path.watch.style], function (event, cb) {
    gulp.start('style:build');
  });
    gulp.watch([path.watch.js], function (event, cb) {
    gulp.start('js:build');
  });
    gulp.watch([path.watch.img], function (event, cb) {
    gulp.start('image:build');
  });
    gulp.watch([path.watch.fonts], function (event, cb) {
    gulp.start('fonts:build');
  });
});

// START DEFAULT
gulp.task('default', ['build', 'connect', 'watch']);

