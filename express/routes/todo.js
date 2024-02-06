const express = require("express");
const router = express.Router();
const Todo = require("../model/Todo");

router.get("/", function (req, res, next) {
  Todo.find()
    .then((todos) => {
      res.json(todos);
      //res.send(res.json(todos));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id", function (req, res, next) {
  Todo.findById(req.params.id)
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/", function (req, res, next) {
  Todo.create(req.body)
    .then((todo) => {
      res.status(201).json(todo);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:todoId", function (req, res, next) {
  Todo.findByIdAndUpdate(req.params.todoId, req.body)
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:todoId", function (req, res, next) {
  Todo.findByIdAndDelete(req.params.todoId)
    .then(() => {
      res.json({ message: "삭제 완료" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
