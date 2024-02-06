require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
const password = process.env.password;

const mongoose = require("mongoose");

mongoose
  .connect(`mongodb+srv://admin:${password}@cluster0.qui8bja.mongodb.net/`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected Successful"))
  .catch((rr) => console.log(err));

var app = express();

app.use(logger("dev"));

app.use("", (req, res, next) => {
  req.user = {
    //req.user을 다음 미들웨어들에게 넘겨줄 수 있음
    name: "한다현",
  };
  if (req.user === undefined) {
    res.status(403).json({});
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// const birdsRouter = require("./routes/birds");
// app.use("/birds", birdsRouter);

// app.get("/sample", (req, res) => {
//   res.send("hello world");
// });

// app.post("/sample", (req, res) => {
//   res.send("Create First POST router");
// });

// const boardRouter = require("./routes/board");
// app.use("/board", boardRouter);

// const watchaRouter = require("./routes/watcha");
// app.use("/watcha", watchaRouter);

const todoRouter = require("./routes/todo");
app.use("/todo", todoRouter);

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
  res.json({
    error: err.message,
  });
  // res.render("error");
});

module.exports = app;
