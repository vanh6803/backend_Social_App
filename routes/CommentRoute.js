var express = require("express");
var router = express.Router();
const controller = require("../controllers/CommentController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/SetupClouldinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "comment",
    format: "png",
  },
});

const upload = multer({ storage });

router.get("/:idPosts", controller.getCommentForPosts);
router.post(
  "/add/:idPosts/:uid",
  upload.single("image"),
  controller.createComment
);
router.put(
  "/update/:idPosts/:uid/:commentId",
  upload.single("image"),
  controller.updateComment
);
router.delete("/delete/:idPosts/:uid/:commentId", controller.deleteComment);

module.exports = router;
