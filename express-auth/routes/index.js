var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  //console.log(req.cookies); //쿠키 읽기

  // res.cookie("cookieName3", "cookieValue3", {
  //   httpOnly: true,
  // });

  res.render("index", { title: "Express" });
});

module.exports = router;
