const express = require("express");
const router = express.Router();
const Todo = require("../model/Todo");
const User = require("../model/User");
const { createToken, verifyToken } = require("../utils/auth");

router.get("/", function (req, res, next) {
  ///authenticate는 토큰이 있어야 이 함수가 실행된다는 것임
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

router.post("/", authenticate, function (req, res, next) {
  Todo.create(req.body)
    .then((todo) => {
      res.status(201).json(todo);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/:todoId", authenticate, function (req, res, next) {
  Todo.findByIdAndUpdate(req.params.todoId, req.body)
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:todoId", authenticate, function (req, res, next) {
  Todo.findByIdAndDelete(req.params.todoId)
    .then(() => {
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

router.get("/protected", authenticate, async (req, res, next) => {
  console.log(req.user);
  res.json({ data: " 민감한 데이터 " });
});

module.exports = router;
