const express = require("express");
const router = express.Router();
const Board = require("../model/Board");
const Comment = require("../model/Comment");
const User = require("../model/User");
const { createToken, verifyToken } = require("../utils/auth");

/*

/board GET -> 게시글 리스트를 조회
/board POST -> 게시글 자원을 생성해 줘
/board/:boardId GET ->  게시글 자원 중에 boardID 자원을 가져와 줘
/board/:boardId PUT -> 게시글 자원 중 boardID 자원을 수정해 줘
/board/:boardId DELETE ->  게시글 자원 중에 boardID 자원을 삭제해 줘

/board/:boardId/comments GET -> 게시글 자원 중 boardID 자원의 댓글 리스트를 가져와 줘
*/

// router.get("/", (req, res) => {
//   res.send({ test: "hi" });
// });

//authenticate 미들웨어 생성
async function authenticate(req, res, next) {
  //2번방법
  let token = req.cookies.authToken;

  //1번 방법
  let headerToken = req.headers.authorization;
  if (!token && headerToken) {
    token = headerToken.split(" ")[1];
  }

  const user = verifyToken(token);
  req.user = user;

  if (!user) {
    const error = new Error("Authorization Failed");
    error.status = 403;

    next(error);
  }
  next();
}

router.get("/comments", function (req, res, next) {
  Comment.find()
    .then((data) => {
      res.json(data);
      res.send(res.json(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/comments", authenticate, function (req, res, next) {
  const writer = req.user._id ? req.user._id : null;

  console.log(req.board);

  const commentData = { ...req.body, writer };

  Comment.create(commentData)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

// /api/comment/?boardId=:boardId&page=1&size=10 GET (코멘트 조회)
router.get("/comments", function (req, res, next) {
  const { boardId, page, size } = req.query;
  Comment.find({
    board: boardId,
  })
    .skip((page - 1) * size)
    .limit(Number(size))
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/comments/:commentId", authenticate, function (req, res, next) {
  const { commentId } = req.params;
  const writer = req.user._id ? req.user._id : null;
  const { content } = req.body;
  Comment.updateOne(
    {
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

router.delete("/comments/:commentId", authenticate, function (req, res, next) {
  const { commentId } = req.params;

  Comment.deleteOne({
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
      next(err);
    });
});

router.post("/", authenticate, function (req, res, next) {
  const author = req.user ? req.user : null;
  console.log(req.user);

  const boardData = { ...req.body, author };
  console.log(req.body);
  Board.create(boardData)
    .then((board) => {
      res.status(201).json(board); //status(201)은 post 잘되었다는 의미로 표시(?)해주는 느낌
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:boardId", authenticate, function (req, res, next) {
  Board.findByIdAndUpdate(req.params.boardId, req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:boardId", authenticate, function (req, res, next) {
  Board.findByIdAndDelete(req.params.boardId)
    .then(() => {
      //res.json(data);
      res.json({ message: "삭제 완료" });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.signUp(email, password);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;

    const token = createToken(user, tokenMaxAge);
    req.user = token;

    //인증토큰 보내는 방법

    //1. body에 인증토큰 보내고 클라이언트에서는 자바스크립트가 저장소(로컬스토리지, 세션스토리지)에 저장, 자바스크립트가 저장소에서 꺼내서 매 요청마다 Header에 담아 서버에 요청
    user.token = token;

    //2. 쿠키에 인증토큰 저장, http only여야함
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", async (req, res, next) => {
  try {
    //""은 해당 쿠키에 어떠한 값을 저장하지 않고 비우겠다는 의미 -> 빈 문자열로 설정된 쿠키는 무효화
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()), //현재 시간으로 만료시킴
    });

    res.json({ message: "로그아웃 완료" });

    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.get("/protected", authenticate, async (req, res, next) => {
  console.log(req.user);
  res.json({ data: " 민감한 데이터 " });
});

module.exports = router;
