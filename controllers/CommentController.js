const model = require("../models/Comment");

const getCommentForPosts = async (req, res, next) => {};
const createComment = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const postsId = req.params.idPosts;
    let { content, image } = req.body;

    console.log(`uid: ${uid}, postsId: ${postsId}`);

    console.log("file: ", req.file);

    if (req.file) {
      image = req.file.path;
      console.log(image);
    }
    const newComment = new model.comment({
      user_id: uid,
      posts_id: postsId,
      content: content,
      image: image,
    });
    await newComment.save();
    return res
      .status(200)
      .json({ code: 200, message: "create new comment successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const updateComment = async (req, res, next) => {};
const deleteComment = async (req, res, next) => {};

module.exports = {
  getCommentForPosts,
  createComment,
  updateComment,
  deleteComment,
};
