const { account } = require("../models/Account");
const model = require("../models/Posts");
const fs = require("fs");
const cloudinary = require("../config/SetupClouldinary");

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await model.posts.find().populate("user_id");
    return res.status(200).json({
      code: 200,
      data: posts,
      message: "get all posts successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const getForUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const posts = await model.posts.findById(uid);
    return res.status(200).json({
      code: 200,
      data: posts,
      message: "get all posts successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const detailPosts = async (req, res, next) => {
  const uid = req.params.postsId;
};
const createPosts = async (req, res, next) => {
  try {
    let { image, content } = req.body;

    const user = await account.findById(req.params.uid);
    console.log(user);
    if (!user) {
      return res.status(404).json({ code: 404, message: "user not found" });
    }

    console.log("file: ", req.file);

    if (req.file) {
      image = req.file.path;
      console.log(image);
    }
    const newPosts = new model.posts({
      user_id: req.params.uid,
      content: content,
      image: image,
    });
    await newPosts.save();
    return res
      .status(200)
      .json({ code: 200, message: "create new posts successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};
const updatePosts = async (req, res, next) => {};
const deletePosts = async (req, res, next) => {};

module.exports = {
  getAllPosts,
  getForUser,
  detailPosts,
  createPosts,
  updatePosts,
  deletePosts,
};
