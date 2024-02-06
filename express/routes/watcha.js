const express = require("express");
const router = express.Router();
const Watcha = require("../model/Watcha");
//const WatchaComment = require("../model/WatchaComment");

router.get("/", function (req, res, next) {
  Watcha.find()
    .then((data) => {
      res.json(data);
      //res.send(res.json(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/", function (req, res, next) {
  console.log(req.body);
  Watcha.create(req.body)
    .then((data) => {
      res.status(201).json(data); //status(201)은 post 잘되었다는 의미로 표시(?)해주는 느낌
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:watchaId", function (req, res, next) {
  Watcha.findByIdAndUpdate(req.params.watchaId, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:watchaId", function (req, res, next) {
  Watcha.findByIdAndDelete(req.params.watchaId)
    .then(() => {
      //res.json(data);
      res.json({ message: "삭제 완료" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
