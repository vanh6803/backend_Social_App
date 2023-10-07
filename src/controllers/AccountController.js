const accountModel = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email password
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Email and password are required" });
    }

    // check email existing
    const existingUser = await accountModel.account.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ status: 401, message: "Email already exists", isExist: true });
    }

    // create new account and hash password
    const newAccount = new accountModel.account({ email, password });
    const salt = await bcrypt.genSalt(10);
    newAccount.password = await bcrypt.hash(password, salt);

    await newAccount.save();

    return res
      .status(201)
      .json({ status: 201, message: "Created account successfully" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //find account
    const user = await accountModel.account.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: 401, message: "Email not found" });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: 401, message: "Incorrect password" });
    }

    // if password matches, create a new token
    const token = jwt.sign({ userId: user._id }, process.env.KEY_TOKEN, {
      expiresIn: "3d",
    });

    // update token to db
    user.token = token;
    await user.save();

    // return token
    return res.status(201).json({ status: 201, token });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

exports.logout = async (req, res, next) => {};
