import gulp from "gulp";

import rename from "gulp-rename";
import del from "del";
import browserSync from "browser-sync";

//css
import less from "gulp-less";
import csso from "gulp-csso";
import autoPrefixer from "gulp-autoprefixer";
import gulpPlumber from "gulp-plumber";

//html
import fileinclude from "gulp-file-include";
import htmlmin from "gulp-htmlmin";

//js
import concat from "gulp-concat";

//img
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";

//svg
import svgSprite from "gulp-svg-sprite";



gulp.task("less", function() {
  return gulp.src("./#src/less/**/style.less")
    .pipe(gulpPlumber())
    .pipe(less())
    .pipe(autoPrefixer("last 5 version"))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
})

gulp.task("html", function() {
  return gulp.src("./#src/*.html")
    .pipe(fileinclude())
    .pipe(gulp.dest("./build"))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
})

gulp.task("js", function() {
  return gulp.src("./#src/js/**/*.*")
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.stream());
})

gulp.task("img", function() {
  return gulp.src("./#src/img/**/*.*")
    .pipe(imagemin(
    	{ optimizationLevel: 5 },
    ))
    .pipe(gulp.dest("build/img"))
    .pipe(browserSync.stream());
})

gulp.task("svgSprites", function() {
  return gulp.src("./#src/img/**/icon-*.svg")
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(gulp.dest("build"))
    .pipe(browserSync.stream());
})

gulp.task("getWebp", function() {
  return gulp.src("#src/img/**/*.+(png|jpg)")
    .pipe(webp({
      qualiti: 100,
    }))
    .pipe(gulp.dest("build/img"))
    .pipe(browserSync.stream());
})


gulp.task("fonts", function() {
  return gulp.src("#src/fonts/**/*.+(woff|woff2)")
    .pipe(gulp.dest("build/fonts"))
})

gulp.task("watchFiles", function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch("./#src/less/**/*.less", gulp.parallel("less"));
  gulp.watch("./#src/**/*.html", gulp.parallel("html"));
  gulp.watch("./#src/img/**/*.*", gulp.parallel("img", "getWebp", "svgSprites"));
  gulp.watch("./#src/img/**/*.svg", gulp.parallel("svgSprites"));
  gulp.watch("./#src/js/**/*.*", gulp.parallel("js"));
})

gulp.task("clean", function() {
  return del("build");
})

export default gulp.series("clean", gulp.parallel("img", "getWebp", "html", "less", "js", "fonts", "svgSprites"), "watchFiles");
