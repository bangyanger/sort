var gulp = require("gulp");
var scss = require("gulp-sass");
var web = require("gulp-webserver");

var url = require("url");
var path = require("path");
var fs = require("fs")

var data = require("./src/data/data.json")

gulp.task("scss", function() {
    return gulp.src("src/scss/*.scss")
        .pipe(scss())
        .pipe(gulp.dest("src/css"))
})

gulp.task("watch", function() {
    gulp.watch("src/scss/*.scss", gulp.series("scss"))
})

gulp.task("web", function() {
    return gulp.src("src/")
        .pipe(web({
            port: 9566,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                pathname = url.parse(req.url).pathname
                console.log(pathname)
                if (pathname === "/favicon.ico") {
                    res.end()
                } else if (pathname === "/api/list") {

                    var params = url.parse(req.url, true).query,
                        key = params.key,
                        type = params.type,
                        limit = params.limit,
                        page = params.page;
                    var target = [];
                    data.forEach(function(item) {

                        if (item.title.match(key) != null) {
                            target.push(item)
                        }
                    })
                    var newArr = [];
                    if (type == "normal") {
                        console.log(1)
                        newArr = target;
                    } else if (type == "sale") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return a.salenum - b.salenum;
                        })
                    } else if (type == "asc") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return a.price - b.price;
                        })
                    } else if (type == "desc") {
                        newArr = target.slice(0).sort(function(a, b) {
                            return b.price - a.price;
                        })
                    }

                    var start = (page - 1) * limit;
                    var end = page * limit;
                    var endArr = newArr.slice(start, end);
                    console.log(endArr)
                    var total = Math.ceil(newArr.length / limit)



                    res.end(JSON.stringify({ code: 1, data: endArr, total: total }))
                } else {
                    pathname = pathname === "/" ? "index.html" : pathname
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }
            }
        }))
})

gulp.task("dev", gulp.series("scss", "web", "watch"));