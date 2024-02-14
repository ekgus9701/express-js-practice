var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
require("dotenv").config();
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var profileRouter = require("./routes/profile");

const password = process.env.password;

mongoose
  .connect(
    `mongodb+srv://admin:${password}@cluster0.qui8bja.mongodb.net/my-auth`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Connected Successful"))
  .catch((rr) => console.log(err));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //스트링으로 오는 쿠키를 자바스크립트 객체로 바꿔줌
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "<my-secret>",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  })
);

// app.use("/", indexRouter);
//app.use("/users", usersRouter);
// app.use("/profile", profileRouter);

const todoRouter = require("./routes/todo");
app.use("/todo", todoRouter);

const boardRouter = require("./routes/board");
app.use("/board", boardRouter);

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
  res.render("error");
});

module.exports = app;
