var express = require("express");
var router = express.Router();
var controller = require("../controllers/AccountController");
var middleware = require("../middleware/AuthMiddleware");
const multer = require("multer");
const path = require("path");

// Set up multer storage and upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/logout", middleware.checkToken, controller.logout);
router.get("/user/profile", middleware.checkToken, controller.profile);
router.put(
  "/user/editProfile",
  middleware.checkToken,
  upload.single("avatar"),
  controller.editProfile
);
router.get("/verify/:code", controller.verifyEmail);
router.post("/resend-confirmation-code", controller.resendConfirmationCode);

module.exports = router;
