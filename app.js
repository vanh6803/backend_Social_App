var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var postsRouter = require("./routes/PostsRoute");
var messageRouter = require("./routes/MessageRoute");
var accountRouter = require("./routes/AccountRoute");
var commentRouter = require("./routes/CommentRoute");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/", accountRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comment", commentRouter);
app.use("/api/chat", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req.originalUrl.indexOf("/api") == 0) {
    res.json({
      status: 0,
      msg: err.message,
    });
  } else {
    res.render("sites/error");
  }
});

module.exports = app;
