const accountModel = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require("../config/SetupClouldinary");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email password
    if (!email || !password) {
      return res
        .status(400)
        .json({ code: 400, message: "Email and password are required" });
    }

    // check email existing
    const existingUser = await accountModel.account.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ code: 401, message: "Email already exists" });
    }

    // create new account and hash password
    const newAccount = new accountModel.account({ email, password });
    const salt = await bcrypt.genSalt(10);
    newAccount.password = await bcrypt.hash(password, salt);

    await newAccount.save();

    return res.status(201).json({
      code: 201,
      message: "Created account successfully",
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email password
    if (!email || !password) {
      return res
        .status(400)
        .json({ code: 400, message: "Email and password are required" });
    }

    //find account
    const user = await accountModel.account.findOne({ email });

    if (!user) {
      return res.status(401).json({ code: 401, message: "Email not found" });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: "Incorrect password" });
    }

    // if password matches, create a new token
    const token = jwt.sign({ userId: user._id }, process.env.KEY_TOKEN);

    // update token to db
    user.token = token;
    await user.save();

    // return token
    return res
      .status(201)
      .json({ code: 201, token, message: "login successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const logout = async (req, res, next) => {
  try {
    // find user
    const user = await accountModel.account.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    // remove token
    user.token = null;

    await user.save();

    return res.status(200).json({ code: 200, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await accountModel.account.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ code: 404, message: "user not found" });
    }

    return res
      .status(200)
      .json({ code: 200, data: user, message: "get profile successful" });
  } catch (error) {
    return res.status(500).json({ code: 500, message: error.message });
  }
};

const editProfile = async (req, res, next) => {
  try {
    const dataUpdate = req.body;
    console.log(
      `dataUpdate-1: ${dataUpdate.avatar}, ${dataUpdate.name}, ${dataUpdate.bio} `
    );
    const user = await accountModel.account.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ code: 404, message: "user not found" });
    }

    console.log("file: ", req.file);
    if (req.file) {
      const result = await cloudinary.cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "user",
        }
      );
      fs.unlinkSync(req.file.path);
      dataUpdate.avatar = result.secure_url;
    }
    console.log("dataUpdate: ", dataUpdate);

    await accountModel.account.findByIdAndUpdate(
      { _id: req.user._id },
      dataUpdate,
      { new: true }
    );
    return res
      .status(200)
      .json({ code: 200, data: dataUpdate, message: "update successful" });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ status: 400, message: error.message });
  }
};

const verifyEmail = (req, res, next) => {};

module.exports = {
  verifyEmail,
  register,
  login,
  logout,
  profile,
  editProfile,
};
