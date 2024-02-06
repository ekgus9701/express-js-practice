const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/", (req, res, next) => {
  //console.log(req);
  res.send("Birds home page");
});

router.get("/about", (req, res, next) => {
  //console.log(req);
  res.send("About birds");
});

module.exports = router;
