var express = require("express");
var router = express.Router();
var controller = require("../controllers/AccountController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/logout", controller.logout);

module.exports = router;
