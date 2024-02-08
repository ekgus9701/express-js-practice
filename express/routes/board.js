const express = require("express");
const router = express.Router();
const Board = require("../model/Board");
const Comment = require("../model/Comment");

/*

/board GET -> 게시글 리스트를 조회
/board POST -> 게시글 자원을 생성해 줘
/board/:boardId GET ->  게시글 자원 중에 boardID 자원을 가져와 줘
/board/:boardId PUT -> 게시글 자원 중 boardID 자원을 수정해 줘
/board/:boardId DELETE ->  게시글 자원 중에 boardID 자원을 삭제해 줘

/board/:boardId/commenㅊㅇts GET -> 게시글 자원 중 boardID 자원의 댓글 리스트를 가져와 줘
*/

// router.get("/", (req, res) => {
//   res.send({ test: "hi" });
// });

router.get("/:boardId/comments/", function (req, res, next) {
  const { boardId } = req.params;
  Comment.find({
    board: boardId,
  })
    .then((comments) => {
      res.json(comments);
    })
    .catch((err) => {
      next(err);
    });
});

// router.get("/:boardId/comments/:commentId", function (req, res, next) {
//   Comment.find()
//     .then((data) => {
//       res.json(data);
//       //res.send(data);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.post("/:boardId/comments/", function (req, res, next) {
  const { boardId } = req.params;
  const { content, writer } = req.body;

  Comment.create({
    content,
    writer,
    board: boardId,
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:boardId/comments/:commentId", function (req, res, next) {
  Board.findById(req.params.commentId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:boardId/comments/:commentId", function (req, res, next) {
  const { boardId, commentId } = req.params;
  const { content, writer } = req.body;
  Comment.updateOne(
    {
      board: boardId,
      _id: commentId,
    },
    { writer, content }
  )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:boardId/comments/:commentId", function (req, res, next) {
  const { boardId, commentId } = req.params;
  Comment.deleteOne({
    board: boardId,
    _id: commentId,
  })
    .then(() => {
      res.json({ message: "삭제 완료" });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/", function (req, res, next) {
  Board.find()
    .then((board) => {
      res.json(board);
      res.send(res.json(board));
    })
    .catch((err) => {
      next(err);
    });
});

//포스트맨에서 :는 생략하고 그냥 id 넣어줘야함
router.get("/:id", function (req, res, next) {
  Board.findById(req.params.id)
    .then((board) => {
      res.json(board);
    })
    .catch((err) => {
      console.log("야 안돼");
      next(err);
    });
});

router.post("/", function (req, res, next) {
  console.log(req.body);
  Board.create(req.body)
    .then((board) => {
      res.status(201).json(board); //status(201)은 post 잘되었다는 의미로 표시(?)해주는 느낌
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:boardId", function (req, res, next) {
  Board.findByIdAndUpdate(req.params.boardId, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:boardId", function (req, res, next) {
  Board.findByIdAndDelete(req.params.boardId)
    .then(() => {
      //res.json(data);
      res.json({ message: "삭제 완료" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
